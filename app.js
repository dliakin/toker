const express = require('express')
const config = require('config')
const path = require('path')
const cors = require('cors')
const CronJob = require('cron').CronJob
const TikTokScraper = require('tiktok-scraper')
const models = require('./models')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/accaunt', require('./routes/accaunt.routes'))
app.use('/api/plan', require('./routes/plan.routes'))
app.use('/api/feed', require('./routes/feed.routes'))

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
            const newAccauntData = await TikTokScraper.getUserProfileInfo(accaunt.uniqueId)
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

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))