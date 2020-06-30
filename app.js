const express = require('express')
const config = require('config')
const path = require('path')
const cors = require('cors')
const http = require('http')
const https = require('https')
const CronJob = require('cron').CronJob
const TikTokScraper = require('tiktok-scraper')
const fs = require('fs')
const models = require('./models')

httpApp = express()
const app = express()

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/accaunt', require('./routes/accaunt.routes'))
app.use('/api/plan', require('./routes/plan.routes'))
app.use('/api/feed', require('./routes/feed.routes'))
app.use('/api/system', require('./routes/system.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

var saveStats = new CronJob('0 0 */1 * * *', async function () {
    try {
        const accaunts = await models.Accaunt.findAll({
            where: {
                active: 1
            }
        })
        accaunts.forEach(async accaunt => {
            const newAccauntData = await TikTokScraper.getUserProfileInfo(accaunt.uniqueId, { proxy: config.get('proxy') })
            accauntData = await models.AccauntData.create({
                accauntId: accaunt.id,
                following: newAccauntData.following,
                fans: newAccauntData.fans,
                heart: newAccauntData.heart,
                video: newAccauntData.video,
                digg: newAccauntData.digg,
            })
        });
    } catch (error) {
        //TODO обработать ошибку
        console.log(error)
    }
}, null, true, 'Europe/Moscow')

async function start() {
    try {
        saveStats.start();
    } catch (error) {
        console.log('Server Error', error.message)
        process.exit(1)
    }
}

start()
if (process.env.NODE_ENV === 'production') {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/toker.team/privkey.pem', 'utf8')
    const certificate = fs.readFileSync('/etc/letsencrypt/live/toker.team/cert.pem', 'utf8')
    const ca = fs.readFileSync('/etc/letsencrypt/live/toker.team/chain.pem', 'utf8')
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    }

    httpApp.set('port', PORT || 80)
    httpApp.get("*", function (req, res, next) {
        res.redirect("https://" + req.headers.host + "/" + req.path);
    })

    http.createServer(httpApp).listen(httpApp.get('port'), function () {
        console.log('Express HTTP server listening on port ' + httpApp.get('port'));
    });

    https.createServer(credentials, app).listen(443, function () {
        console.log('Express HTTPS server listening on port 443...');
    });

} else {
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
}
