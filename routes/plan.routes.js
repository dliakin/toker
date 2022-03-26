const { Router } = require('express')
const r2 = require('r2')
const config = require('config')
const bcrypt = require('bcryptjs')
const Telegram = require('telegraf/telegram')
const { Op } = require('sequelize')
var moment = require('moment-timezone')
var generator = require('generate-password')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const nodemailer = require("nodemailer")
const models = require('../models')
const auth = require('../middleware/auth.middleware')
const createPay = require('../utils/payment')
const router = Router()
const telegram = new Telegram(config.get("telegramToken"))

const transporter = nodemailer.createTransport({
    host: "",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "", // generated ethereal user
        pass: "", // generated ethereal password
    },
    tls: {
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false
    }
})

router.get(
    '/',
    async (req, res) => {
        try {
            const plans = await models.Plan.findAll()

            for (var i = 0; i < plans.length; i++) {
                plan = plans[i]
                //TODO Купоны перенести в базу данных
                if (req.query.coupon == "lastchance") {
                    plan.price = plan.price - 100 * plan.duration
                }
                if (req.query.coupon == "5465") {
                    plan.price = plan.price - 100 * plan.duration
                }
                if (req.query.coupon == "sale19") {
                    plan.fee = 0
                }
            }

            res.json(plans)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

// Оплата на лендинге. Регистрация пользователя и переадрисация его на страницу оплаты
router.post(
    '/:id',
    [
        check('email', 'Некорректный email').trim().normalizeEmail().isEmail(),

    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: `Некорректный email`
                })
            }

            const { name, tel, email, telegram } = req.body

            var user = null
            user = await models.User.findOne({
                where: {
                    email
                }
            })

            if (!user) {
                var password = generator.generate({
                    length: 6,
                    numbers: true
                })
                const hashedPassword = await bcrypt.hash(password, 12)
                user = await models.User.create({ email, password: hashedPassword, telegramName: telegram, tel, utm: JSON.stringify(req.query) })

                const from = {
                    name: 'TOKER TEAM',
                    address: 'info@toker.team'
                }

                const to = {
                    name: name,
                    address: email
                }

                const info = await transporter.sendMail({
                    from: from, // sender address
                    to: to, // list of receivers
                    subject: "Регистрация в клубе TOKER TEAM", // Subject line
                    text: `Добро пожаловать!\n\n`
                        + `Я рада привествовать вас в нашем клубе TOKER TEAM\n\n`
                        + `Ниже ваши данные для входа в приложение:\n\n`
                        + `Логин:${email}\nПароль:${password}\n\n`
                        + `Если у вас возникнут вопросы просто ответьте на это письмо или напишите в телеграм https://t.me/dlyakin\n\n`
                        + `С уважением,\n`
                        + `Даша Чер\n`, // plain text body
                    html: `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                        <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                     <title>Регистрация в клубе TOKER TEAM</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    </head>
                    <body style="margin: 0; padding: 0;">
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td>
                                    <table width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="font-family: Roboto,Arial,sans-serif; box-sizing: border-box; padding: 25px 0; text-align: center;">
                                                    <a style="box-sizing: border-box; color: #bbbfc3; font-size: 19px; font-weight: bold; text-decoration: none; display: inline-block;"
                                                        href="https://toker.team/signin/" target="_blank" rel="noopener">
                                                        TOKER TEAM </a></td>
                                            </tr>
                                            <tr>
                                                <td style="box-sizing: border-box; background-color: #ffffff; border-bottom: 1px solid #edeff2; border-top: 1px solid #edeff2; margin: 0; padding: 0; width: 100%;"
                                                    width="100%">
                                                    <table
                                                        style="box-sizing: border-box; background-color: #ffffff; margin: 0 auto; padding: 0; width: 570px;"
                                                        width="570" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="box-sizing: border-box; padding: 35px;">
                                                                    <h1
                                                                        style="font-family: Roboto,Arial,sans-serif; box-sizing: border-box; color: #2f3133; font-size: 19px; font-weight: bold; margin-top: 0; text-align: left;">
                                                                        Добро пожаловать!</h1>
                                                                    <p
                                                                        style="font-family: Roboto,Arial,sans-serif; box-sizing: border-box; color: #74787e; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                                                        Ваши данные для доступа к клубу <a
                                                                            style="box-sizing: border-box; color: #3869d4;"
                                                                            href="https://toker.team/signin/" target="_blank"
                                                                            rel="noopener"><span class="il">TOKER</span> TEAM</a>:</p>
                                                                    <p
                                                                        style="font-family: Roboto,Arial,sans-serif; box-sizing: border-box; color: #74787e; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                                                        <strong style="box-sizing: border-box;">Логин</strong>:
                                                                       ${email}</p>
                                                                    <p
                                                                        style="font-family: Roboto,Arial,sans-serif; box-sizing: border-box; color: #74787e; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                                                        <strong style="box-sizing: border-box;">Пароль</strong>:
                                                                        ${password}</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="box-sizing: border-box;">
                                                    <table
                                                        style="box-sizing: border-box; margin: 0 auto; padding: 0; text-align: center; width: 570px;"
                                                        role="presentation" width="570" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="box-sizing: border-box; padding: 35px;">
                                                                    <p
                                                                        style="font-family: Roboto,Arial,sans-serif; box-sizing: border-box; line-height: 1.5em; margin-top: 0; color: #aeaeae; font-size: 12px; text-align: center;">
                                                                        &copy; 2020 Toker Team. All rights reserved.</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </body>
                    </html>
                    `
                })

                console.log(info);

                const token = jwt.sign(
                    { userId: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: '3d' }
                )

                const payurl = await createPay(req.params.id, user.id, req.query.coupon, true)
                return res.json({ payurl, user: { token, userId: user.id, email: user.email } })
            }

            //TODO Надо что-то сделать, если пользователь уже есть. Точно не авторизировать его т.к. он не ввёл пароль
            const payurl = await createPay(req.params.id, user.id, req.query.coupon)
            res.json({ payurl })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/success',
    async (req, res) => {
        try {

            var dt = new Date()

            const pay = await models.Pay.findOne({
                where: {
                    id: req.query.id
                }
            })

            const existingPay = await models.Pay.findOne({
                where: {
                    userId: pay.userId,
                    paidTo: { [Op.gte]: dt },
                    active: true
                }
            })

            if (existingPay && existingPay.id == req.query.id) {
                console.log("ОШИБКА. Повторно вызвана успешная ссылка: ", existingPay.id)
                return res.redirect(`${config.get('clientUrl')}/success`)
            }

            const plan = await models.Plan.findOne({
                where: {
                    id: pay.planId
                }
            })

            const key = "8K0vWxYwT157g98y5Pvx";
            const prefix = `toker${process.env.NODE_ENV}`

            const payStatus = JSON.parse(await r2(`https://shipe.ru/chat/pay_travel.php?key=${key}&func=gCHECK&id=${pay.paymentid}`).text)
            //TODO Сумму проверять с учётом купона
            if (payStatus.Success !== true || payStatus.Status !== 'CONFIRMED' /*|| payStatus.Amount !== plan.price * 100*/) {
                //TODO Если не прошли проверку - выдать сообщение пользователю
                console.log("Ошибка проверки платежа: ", payStatus.Status)
                return res.redirect(`${config.get('clientUrl')}/success`)
            }

            if (existingPay) {
                dt = existingPay.paidTo
                existingPay.active = false
                await existingPay.save()
            }

            const user = await models.User.findOne({
                where: {
                    id: pay.userId
                }
            })

            user.roleId = plan.role
            await user.save()

            dt.setMonth(dt.getMonth() + plan.duration)
            pay.paidTo = dt
            pay.realSum = req.query.sum
            pay.active = true
            await pay.save()

            //Разбаниваем пользователя в Телеграм и присылаем ему уведомления
            const telegramUser = await models.TelegramUser.findOne({
                where: {
                    userId: user.id
                }
            })

            if (telegramUser) {
                //TODO Проверить перед разбаном, что это не админ
                try {
                    let chatMember = await telegram.getChatMember(-1001185920407, telegramUser.telegramId)
                    if (chatMember.status !== 'member')
                        await telegram.unbanChatMember(-1001185920407, telegramUser.telegramId)

                    chatMember = await telegram.getChatMember(-1001448422474, telegramUser.telegramId)
                    if (chatMember.status !== 'member')
                        await telegram.unbanChatMember(-1001448422474, telegramUser.telegramId)

                    chatMember = await telegram.getChatMember(-1001198187467, telegramUser.telegramId)
                    if (chatMember.status !== 'member')
                        await telegram.unbanChatMember(-1001198187467, telegramUser.telegramId)

                    chatMember = await telegram.getChatMember(-1001311987827, telegramUser.telegramId)
                    if (chatMember.status !== 'member')
                        await telegram.unbanChatMember(-1001311987827, telegramUser.telegramId)

                    await telegram.sendMessage(telegramUser.telegramId, 'Добро пожаловать в клуб!\n'
                        + '\n'
                        + 'ССЫЛКИ КЛУБА:\n'
                        + '\n'
                        + 'Телеграм:\n'
                        + '1. Канал клуба - https://t.me/joinchat/AAAAAE4zWHOHn8aU_Z8PmA\n'
                        + '2. Чат клуба - https://t.me/joinchat/CEzYchs2XQ6SlN8tIQgUEg\n'
                        + '3. Чат с идеями для видео - https://t.me/joinchat/CEzYch0xmwYZCChaR5vYIw\n'
                        + '4. Канал Тредсеттеров - https://t.me/joinchat/AAAAAEdq48uaeuEBf0dt2Q\n'
                        + '5. Бот для скачивания видео без водяного знака - @tiktok_helper_bot\n'
                        + '6. Общий канал с трендами - @tiktok_day_trends\n'
                        + '7. Канал с общими новостями - @tokerclub'
                        + '\n'
                        + 'Приложение по статистике:\n'
                        + '8. Приложение - https://dashacher.agency/app\n'
                        + '\n'
                        + 'База знаний:\n'
                        + '9. База знаний - https://cher.zenclass.ru/public/course/c1fcd75d-5faf-49b9-ab7a-4d2dadc04569\n'
                        + '\n'
                        + 'Если вы регистрируетесь в базу знаний не под своей почтой, напишите об этом @dlyakin. Добавление происходит в ручном режиме, если почты разные - вас не добавят.\n'
                        + '\n'
                        + '\n'
                        + 'Немного о правилах:\n'
                        + '❌ Здесь запрещена реклама сторонних сервисов и ботов (мы сделали все сами 😁)\n'
                        + '❌ Запрещено оскорблять участников клуба.\n'
                        + '\n'
                        + 'Что разрешено и что нужно делать:\n'
                        + '✅ Спрашивать о любых непонятных моментах по ТикТоку (перед этим обязательно загляни в базу знаний и посмотри вебинар, часть вопросов отпадет сама собой)\n'
                        + '✅ Просить обратную связь по своему ролику\n'
                        + '✅ Узнавать как сняты ролики\n'
                        + '✅ Делиться полезными знаниями и опытом\n'
                        + '\n'
                        + '\n'
                        + 'Обязательно поставьте приложение.\n'
                        + 'Оно поможет анализировать аккаунт и смотреть статистику\n'
                        + '\n'
                        + 'https://dashacher.agency/app\n'
                        + '\n'
                        + 'По любым вопросам по приложению можно смело писать @dlyakin\n'
                        + '\n'
                        + 'И мы очень рады любой обратной связи по приложению, потому что сейчас оно активно разрабатывается.\n'
                        + '\n'
                        + 'В ближайшее время мы добавим туда игровую механику, чтобы всегда была мотивация. Ведь без неё иногда опускаются руки, а нам это не надо. В Тикток нужно выкладывать каждый день 👌\n'
                        + '\n'
                        + '\n'
                        + 'С чего начать?\n'
                        + '\n'
                        + 'Подключайся по всем ссылкам выше, ставь приложение и открывай базу знаний.\n'
                        + 'Это полноценный курс про ТикТок.\n'
                        + '\n'
                        + 'По любым вопросам пиши в общий чат 🤗'
                    )
                } catch{

                }

            }

            var utm = {}
            if (user.utm) {
                utm = JSON.parse(user.utm)
            }

            await telegram.sendMessage(139253874,
                `Новая оплата!\n\n`
                + `Оплата №${pay.id}\n`
                + `Сумма: ${pay.realSum} руб\n`
                + `Дата: ${moment(pay.updatedAt).format('YYYY-MM-DD HH:mm')}\n`
                + `Email: ${user.email}\n`
                + `Телеграм: @${telegramUser ? telegramUser.username ? telegramUser.username : user.telegramName : user.telegramName}\n`
                + `Откуда: ${utm.from ? utm.from : "-"}\n`
                + `Реферал: ${utm.ref ? utm.ref : "-"}\n`

            )

            //TODO Если этот пользователь пришёл по реферальной ссылке, то добавляем 7 дней владельцу ссылки

            if (utm.ref) {
                const partner = await models.Partner.findOne({
                    where: {
                        userId: utm.ref
                    }
                })
                if (partner) {
                    const partnerPay = await models.PartnerPay.create({
                        partnerId: partner.id,
                        payId: pay.id,
                        paidOut: false,
                    })
                } else {
                    const referal = await models.User.findOne({
                        where: {
                            id: utm.ref
                        }
                    })

                    if (referal) {

                        var dt = new Date()

                        const existingPay = await models.Pay.findOne({
                            where: {
                                userId: referal.id,
                                paidTo: { [Op.gte]: dt },
                                active: true
                            }
                        })

                        if (existingPay) {
                            dt = existingPay.paidTo
                            existingPay.active = false
                            await existingPay.save()
                        }

                        const refPay = await models.Pay.create({
                            userId: referal.id,
                            planId: existingPay.planId,
                            paidTo: moment(dt).add(7, 'days').toDate(),
                            realSum: 0,
                            active: 1,
                            paymentid: -1 * (100000000 + user.id)
                        })

                    }
                }

                utm.refChecked = utm.ref
                delete utm.ref
                user.utm = JSON.stringify(utm)
                await user.save()
            } else if (utm.refChecked) {
                const partner = await models.Partner.findOne({
                    where: {
                        userId: utm.refChecked
                    }
                })
                if (partner) {
                    const partnerPay = await models.PartnerPay.create({
                        partnerId: partner.id,
                        payId: pay.id,
                        paidOut: false,
                    })
                }
            }


            //TODO Редирект надо куда-то на страницу профиля
            return res.redirect(`${config.get('clientUrl')}/success`)
        } catch (error) {
            console.log("/success:", error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/checkPay',
    auth,
    async (req, res) => {
        try {
            const existingPay = await models.Pay.findOne({
                where: {
                    userId: req.user.userId,
                    paidTo: { [Op.gte]: new Date() }
                }
            })

            if (!existingPay) {
                return res.json({ isPay: true })
            }

            return res.json({ isPay: false })
        } catch (error) {
            console.log("/checkPay:", error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/getPayUrl/:id',
    auth,
    async (req, res) => {
        try {
            const payurl = await createPay(req.params.id, req.user.userId, req.query.coupon)
            res.json({ payurl })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router
