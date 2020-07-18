const express = require('express')
const config = require('config')
const path = require('path')
const cors = require('cors')
const http = require('http')
const https = require('https')
const Telegram = require('telegraf/telegram')
const Telegraf = require('telegraf')
const CronJob = require('cron').CronJob
const TikTokScraper = require('tiktok-scraper')
const fs = require('fs')
var moment = require('moment-timezone')
const { Op } = require('sequelize')
const models = require('./models')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const ngrok = require('ngrok')
const createPay = require('./utils/payment')

var httpApp = express()
const app = express()
const telegramApp = express()
const telegram = new Telegram(config.get("telegramToken"))
const bot = new Telegraf(config.get("telegramToken"))
var url2 = config.get('baseUrl')

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/accaunt', require('./routes/accaunt.routes'))
app.use('/api/plan', require('./routes/plan.routes'))
app.use('/api/feed', require('./routes/feed.routes'))
app.use('/api/system', require('./routes/system.routes'))
app.use('/api/admin', require('./routes/admin.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'app')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'app', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

//TODO Банить тех, кого нет в БД
// {
//        message_id: 3208,
//        from: {
//          id: 1000352699,
//          is_bot: false,
//          first_name: 'TikTok Channel Admin',
//          username: 'tiktok_channels_admin'
//        },
//        chat: {
//          id: -1001185920407,
//          title: 'Клуб ТИКТОК � ЧАТ',
//          type: 'supergroup'
//        },
//        date: 1594826654,
//        new_chat_participant: {
//          id: 1000352699,
//          is_bot: false,
//          first_name: 'TikTok Channel Admin',
//          username: 'tiktok_channels_admin'
//        },
//        new_chat_member: {
//          id: 1000352699,
//          is_bot: false,
//          first_name: 'TikTok Channel Admin',
//          username: 'tiktok_channels_admin'
//        },
//        new_chat_members: [
//          {
//            id: 1000352699,
//            is_bot: false,
//            first_name: 'TikTok Channel Admin',
//            username: 'tiktok_channels_admin'
//          }
//        ]
//      }
bot.on('new_chat_members', async (ctx) => {
    try {
        const existingTelegramUser = await models.TelegramUser.findOne({
            where: {
                telegramId: ctx.update.message.from.id
            }
        })

        if (!existingTelegramUser) {
            await telegram.kickChatMember(ctx.update.message.chat.id, ctx.update.message.from.id)

            telegram.sendMessage(ctx.update.message.from.id,
                `Здравствуйте! \n\n`
                + `У вас нет доступа в клуб\n`
                + `Получить доступ:\n`
                + `https://toker.team/\n`
                + `По любым вопросам пишите @dlyakin\n`
            )

            telegram.sendMessage(139253874,
                `ОШИБКА! Вход незарегистрированного пользователя \n\n`
                + `Канал: ${ctx.update.message.chat.title}\n`
                + `Пользователь: ${ctx.update.message.from.id} ${ctx.update.message.from.first_name} @${ctx.update.message.from.username}\n`
            )
        }
    } catch (error) {
        console.log(error)
    }
})

bot.start(async (ctx) => {
    console.log(ctx.startPayload)
    const keyboard = Markup.inlineKeyboard([
        Markup.loginButton('Получить доступ', `${url2}/api/auth/linktg?user_id=${ctx.startPayload}`, {
            bot_username: config.get('botName'),
            request_write_access: true
        }),
    ])
    return ctx.reply('Нажмите, что бы получить доступ:', Extra.markup(keyboard))
})

bot.on('callback_query', async (ctx) => {
    // Explicit usage
    const telegramUser = await models.TelegramUser.findOne({
        where: {
            telegramId: ctx.callbackQuery.from.id
        }
    })

    if (telegramUser) {

        const pay = await models.Pay.findOne({
            where: {
                userId: telegramUser.userId
                , active: true
            }
        })

        const planAndCoupon = ctx.callbackQuery.data.split("_")
        var coupon = null
        if (pay) { coupon = planAndCoupon[1] }
        console.log(coupon)
        const payurl = await createPay(planAndCoupon[0], telegramUser.userId, coupon)
        ctx.reply(`Ссылка на оплату:\n${payurl}`)
    } else {
        ctx.reply(`Вы не зарегистрированы в приложении. Напишите @dlyakin`)
    }
    ctx.answerCbQuery("Формирую ссылку на оплату")
})

var saveStats = new CronJob('0 0 */1 * * *', async function () {
    try {
        const accaunts = await models.Accaunt.findAll({
            where: {
                active: 1
            }
        })
        accaunts.forEach(async accaunt => {
            try {
                const newAccauntData = await TikTokScraper.getUserProfileInfo(accaunt.uniqueId, { proxy: config.get('proxy') })
                accauntData = await models.AccauntData.create({
                    accauntId: accaunt.id,
                    following: newAccauntData.following,
                    fans: newAccauntData.fans,
                    heart: newAccauntData.heart,
                    video: newAccauntData.video,
                    digg: newAccauntData.digg,
                })
            } catch (error) {
                //TODO Надо как-то понимать что пользователь действительно не существует, а это не ошибка доступа к ТикТоку
                console.log(`Deactivate user: ${accaunt.uniqueId}`)
                console.log(error)
                //accaunt.active=0
                //accaunt.save()
            }
        })
    } catch (error) {
        //TODO обработать ошибку
        console.log(error)
    }
}, null, true, 'Europe/Moscow')

var saveNewVideos = new CronJob('0 0 */1 * * *', async function () {
    try {
        const accaunts = await models.User.findAll({
            attributes: ['id'],
            include: [
                {
                    model: models.Pay,
                    attributes: [],
                    where: {
                        active: true
                    }
                },
                {
                    model: models.Accaunt,
                    attributes: ['uniqueId', 'id'],
                }
            ],
            where: {
                defaultAccauntId: {
                    [Op.not]: null
                }

            },
            raw: true,
        })
        accaunts.forEach(async accaunt => {
            try {
                const newVideoList = await TikTokScraper.user(accaunt['Accaunts.uniqueId'], { proxy: config.get('proxy'), number: 3 })
                newVideoList.collector.forEach(async video => {
                    const accauntVideo = await models.AccauntVideo.findOrCreate({
                        where: {
                            videoId: video.id
                        },
                        defaults: {
                            accauntId: accaunt['Accaunts.id']
                            , createTime: moment.unix(video.createTime)
                        }
                    })
                })
            } catch (error) {
                console.log(error)
            }
        })
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

                    const plans = await models.Plan.findAll()

                    var buttons = []
                    for (var i = 0; i < plans.length; i++) {
                        plan = plans[i]
                        //Хардкодим купон, т.к. он всегдабудет применяться
                        plan.price = plan.price - 100 * plan.duration
                        buttons.push(new Array(Markup.callbackButton(
                            `${plan.duration} ${plan.duration === 1 ? " МЕСЯЦ" : plan.duration > 1 && plan.duration < 5 ? " МЕСЯЦА" : " МЕСЯЦЕВ"} ${plan.price} руб.`
                            , `${plan.id}_lastchance`
                        )))
                    }

                    var options = {
                        parse_mode: "HTML"
                        , disable_web_page_preview: true
                        , reply_markup: Markup.inlineKeyboard(buttons)
                    }

                    telegram.sendMessage(telegramUser.telegramId,
                        `Здравствуйте! \n\n`
                        + `У вас заканчивается подписка в клуб через ${days} ${days === 1 ? "день" : days === 3 ? "дня" : "дней"}\n`
                        + `Успейте продлить со скидкой 🤗\n`
                        //+ `<a href="https://toker.team/plans?coupon=lastchance">Продлить</a>`
                        , options)

                    telegram.sendMessage(139253874,
                        `Отправлено напоминание за ${days} ${days === 1 ? "день" : days === 3 ? "дня" : "дней"}!\n\n`
                        + `Email: ${user.email}\n`
                        + `Телеграм: @${telegramUser.username}\n`
                    )
                } else {
                    telegram.sendMessage(139253874,
                        `ОШИБКА! Напоминание не отправлено! Не привязан телеграм!\n\n`
                        + `Осталось: ${days} ${days === 1 ? "день" : days === 3 ? "дня" : "дней"}!\n\n`
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
                        paidTo: { [Op.lt]: new Date() }
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
            else {
                telegram.sendMessage(139253874,
                    `ОШИБКА! Пользователь не забанен! Не привязан телеграм!\n\n`
                    + `Email: ${user.email}\n`
                    + `Телеграм: @${telegramUser.username}\n`
                )
            }

            const pay = user.Pays[0]
            pay.active = false
            await pay.save()

            telegram.sendMessage(139253874,
                `Пользователь исключён из клуба!\n\n`
                + `Оплата №${pay.id}\n`
                + `Сумма: ${pay.realSum} руб\n`
                + `Дата: ${moment(pay.createdAt).format('YYYY-MM-DD HH:mm')}\n`
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
        saveNewVideos.start()
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
    })

    https.createServer(credentials, app).listen(443, function () {
        console.log('Express HTTPS server listening on port 443...');
    })

    bot.telegram.setWebhook(`${config.get('baseUrl')}:88/DHfjchjlHcj`)

    telegramApp.get('/', (req, res) => {
        res.send('Hello World!')
    })

    telegramApp.use(bot.webhookCallback('/DHfjchjlHcj'))

    https.createServer(credentials, telegramApp).listen(88, function () {
        console.log('Telegram bot listening on port 88...');
    })

} else {
    (async function () {
        try {
            await ngrok.authtoken('1eSdnYCyxIrQZdx3YEHg6TMZa43_3eCXW9vuC7weoFKXSZ5gc');
            const url = await ngrok.connect(5001)
            url2 = await ngrok.connect(5000)
            console.log(url2)
            bot.telegram.setWebhook(`${url}/DHfjchjlHcj`)

            telegramApp.use(bot.webhookCallback('/DHfjchjlHcj'))
            telegramApp.listen(5001, () => {
                console.log('Telegram bot listening on port 5001!')
            })
        } catch (error) {
            console.log(error)
        }
    })()

    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))

}
