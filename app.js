const express = require('express')
const config = require('config')
const path = require('path')
const cors = require('cors')
const http = require('http')
const https = require('https')
const Telegram = require('telegraf/telegram')
const CronJob = require('cron').CronJob
const TikTokScraper = require('tiktok-scraper')
const fs = require('fs')
var moment = require('moment-timezone')
const { Op } = require('sequelize')
const models = require('./models')

httpApp = express()
const app = express()
const telegram = new Telegram(config.get("telegramToken"))

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

var remindSubExpiried = new CronJob('0 0 12 * * *', async function () {
    try {
        const users = await models.User.findAll({
            include: [
                {
                    model: models.Pay,
                    where: {
                        paidTo: {
                            [Op.and]: [
                                { [Op.lte]: moment().add(8, 'days').toDate() },
                                { [Op.gte]: moment() }
                            ]
                        },
                        active: true
                    }
                },
                {
                    model: models.TelegramUser,
                }
            ]
        })
        users.forEach(async user => {
            const pay = user.Pays[0]
            const days = moment(pay.paidTo).diff(moment(), 'days')
            if (days === 7 || days === 3 || days === 1) {
                if (user.TelegramUser !== null) {

                    telegramUser = user.TelegramUser

                    var options = {
                        parse_mode: "HTML"
                        , disable_web_page_preview: true
                    }

                    telegram.sendMessage(telegramUser.telegramId,
                        `Здравствуйте! \n\n`
                        + `У вас заканчивается подписка в клуб через ${days} ${days === 1 ? "день" : days === 3 ? "дня" : "дней"}\n`
                        + `Успейте продлить со скидкой 🤗\n`
                        + `<a href="https://toker.team/plans?coupon=lastchance">Продлить</a>`
                        , options)

                    telegram.sendMessage(139253874,
                        `Отправлено напоминание за ${days} ${days === 1 ? "день" : days === 3 ? "дня" : "дней"}!\n\n`
                        + `Email: ${user.email}\n`
                        + `Телеграм: @${telegramUser.username}\n`
                    )
                }
            }
        })
    } catch (error) {
        //TODO обработать ошибку
        console.log(error)
    }
}, null, true, 'Europe/Moscow')

var checkUsers = new CronJob('0 0 */1 * * *', async function () {
    try {
        const users = await models.User.findAll({
            include: [
                {
                    model: models.Pay,
                    where: {
                        active: true,
                        paidTo: { [Op.lt]: new Date() } //TODO Это лишнее т.к. у нас всегда одна активная оплата
                    }
                },
                {
                    model: models.TelegramUser,
                }
            ]
        })
        users.forEach(async user => {
            if (user.TelegramUser !== null) {
                telegramUser = user.TelegramUser

                // Клуб тикток чат
                // https://web.telegram.org/#/im?p=s1185920407_17777605011897856854 -1001185920407

                // клуб тикто идеи
                // https://web.telegram.org/#/im?p=s1448422474_13891669535035742641 -1001448422474

                // клуб тикток тренды
                // https://web.telegram.org/#/im?p=c1198187467_16302971017108569062 -1001198187467

                // клуб тикток важное
                // https://web.telegram.org/#/im?p=c1311987827_10130816211160047142 -1001311987827

                await telegram.kickChatMember(-1001185920407, telegramUser.telegramId)
                await telegram.kickChatMember(-1001448422474, telegramUser.telegramId)
                await telegram.kickChatMember(-1001198187467, telegramUser.telegramId)
                await telegram.kickChatMember(-1001311987827, telegramUser.telegramId)

                telegram.sendMessage(139253874,
                    `Здравствуйте! \n\n`
                    + `У вас закончилась подписка в клуб.\n`
                    + `Будем рады видеть вас снова 🤗\n`
                    + `https://toker.team/`
                )
            }

            const pay = user.Pays[0]
            pay.active = false
            pay.save()

            telegram.sendMessage(139253874,
                `Пользователь исключён из клуба!\n\n`
                + `Оплата №${pay.id}\n`
                + `Сумма: ${pay.realSum} руб\n`
                + `Дата: ${moment(pay.updatedAt).format('YYYY-MM-DD HH:mm')}\n`
                + `Email: ${user.email}\n`
                + `Телеграм: @${telegramUser ? telegramUser.username : "Нет в Телеграм"}\n`
            )
        })

    } catch (error) {
        //TODO обработать ошибку
        console.log(error)
    }
}, null, true, 'Europe/Moscow')

async function start() {
    try {
        saveStats.start()
        checkUsers.start()
        remindSubExpiried.start()
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
