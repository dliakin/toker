const { Router } = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const crypto = require('crypto')
const { Op } = require('sequelize');
var moment = require('moment-timezone')
const Telegram = require('telegraf/telegram')
const models = require('../models')
const auth = require('../middleware/auth.middleware')
var generator = require('generate-password')
const nodemailer = require("nodemailer")

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

const router = Router()

router.post(
    '/register',
    [
        check('email', 'Некорректный email').trim().normalizeEmail().isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: `Некорректные данные`
                })
            }

            const { email, password } = req.body

            const candidate = await models.User.findOne({
                where: {
                    email
                }
            })

            if (candidate) {
                return res.status(400).json({ message: `Такой пользователь уже существует` })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = await models.User.create({ email, password: hashedPassword })

            const tildaUser = await models.TildaUser.findOne({
                where: {
                    email
                }
            })

            if (tildaUser) {
                const pay = await models.Pay.create({
                    userId: user.id,
                    planId: 1,
                    paidTo: tildaUser.paidTo,
                    realSum: 0,
                    active: 1,
                    paymentid: -100
                })
                user.roleId = 2
                await user.save()
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '3d' }
            )

            res.json({ token, userId: user.id, email: user.email })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.post(
    '/reset_password',
    [
        check('email', 'Некорректный email').trim().normalizeEmail().isEmail(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: `Некорректные данные`
                })
            }

            const { email } = req.body

            const candidate = await models.User.findOne({
                where: {
                    email
                }
            })

            if (candidate) {
                var password = generator.generate({
                    length: 6,
                    numbers: true
                })
                const hashedPassword = await bcrypt.hash(password, 12)
                candidate.password = hashedPassword
                await candidate.save()

                const from = {
                    name: 'TOKER TEAM',
                    address: 'info@toker.team'
                }

                const to = {
                    name: candidate.name,
                    address: email
                }

                const info = await transporter.sendMail({
                    from: from, // sender address
                    to: to, // list of receivers
                    subject: "Сброс пароля в клубе TOKER TEAM", // Subject line
                    text: `На вашем аккаунте новый пароль!\n\n`
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
                         <title>Сброс пароля в клубе TOKER TEAM</title>
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
                                                                            На вашем аккаунте новый пароль!</h1>
                                                                        <p
                                                                            style="font-family: Roboto,Arial,sans-serif; box-sizing: border-box; color: #74787e; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                                                            Ваши данные для доступа к клубу <a
                                                                                style="box-sizing: border-box; color: #3869d4;"
                                                                                href="https://toker.team/signin/" target="_blank"
                                                                                rel="noopener"><span class="il">TOKER</span> TEAM</a>:</p>
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
            }

            res.json({ message: `Новый пароль отправлен на почту` })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').trim().normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: `Некорректные данные при входе в систему`
                })
            }

            const { email, password } = req.body

            const user = await models.User.findOne({
                where: {
                    email
                }
            })

            if (!user) {
                return res.status(400).json({ message: `Пользователь не найден` })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: `Неверный пароль, попробуйте снова` })
            }

            var partner = await models.Partner.findOne({
                where: {
                    userId: user.id,
                }
            })

            var role = await models.Role.findOne({
                where: {
                    id: user.roleId,
                    code: 'admin'
                }
            })

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '3d' }
            )

            res.json({ token, userId: user.id, email: user.email, defaultAccauntId: user.defaultAccauntId, isPartner: !!partner, isAdmin: !!role })

        } catch (error) {
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.post(
    '/updateUserData',
    auth,
    [
        check('email', 'Введите корректный email').trim().normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: `Некорректные данные при входе в систему`
                })
            }

            const { email, password } = req.body

            const candidate = await models.User.findOne({
                where: {
                    email
                }
            })

            if (candidate && candidate.id !== req.user.userId) {
                return res.status(400).json({ message: `Пользователь с таким email уже существует` })
            }

            const user = await models.User.findOne({
                where: {
                    id: req.user.userId
                }
            })

            user.email = email
            user.password = await bcrypt.hash(password, 12)
            await user.save()

            res.json({ message: `Данные изменены` })

        } catch (error) {
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/loadUserData',
    auth,
    async (req, res) => {
        try {
            const existingPay = await models.Pay.findOne({
                where: {
                    userId: req.user.userId,
                    active: true
                }
            })

            const plan = await models.Plan.findOne({
                where: {
                    id: existingPay.planId,
                }
            })

            const telegramuser = await models.TelegramUser.findOne({
                attributes: ['id', 'username'],
                where: {
                    userId: req.user.userId
                }
            })

            const refsCount = await models.Pay.count({
                where: {
                    paymentid: { [Op.lt]: -100000000 },
                    userId: req.user.userId,
                }
            })

            var tgUser = null
            if (telegramuser)
                if (telegramuser.username)
                    tgUser = telegramuser.username
                else
                    tgUser = telegramuser.id

            res.json({ planName: plan.name, paidTo: moment(existingPay.paidTo).format('YYYY-MM-DD'), tgUser, refsCount })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.post(
    '/setDefaultAccauntId',
    auth,
    async (req, res) => {
        try {
            const { accauntId } = req.body

            const user = await models.User.findOne({
                where: {
                    id: req.user.userId
                }
            })

            user.defaultAccauntId = accauntId
            await user.save()

            res.json({ message: `Данные изменены` })

        } catch (error) {
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/linktg',
    async (req, res) => {
        try {
            const { user_id, id, first_name, last_name, username, auth_date, hash } = req.query

            const secret = crypto.createHash('sha256').update(config.get("telegramToken")).digest();
            let array = []

            for (let key in req.query) {
                if (key != 'hash' && key != 'user_id') {
                    array.push(key + '=' + req.query[key]);
                }
            }
            const check_hash = crypto
                .createHmac('sha256', secret)
                .update(array.sort().join('\n'))
                .digest('hex');

            if (check_hash !== hash) {
                //TODO куда вести в приложении ??
                telegram.sendMessage(id, 'Ошибка приязки телеграм. Напишите @dlyakin')
            }

            var timestamp = Math.floor(new Date().getTime() / 1000)

            if ((timestamp - auth_date) > 86400) {
                //TODO куда вести в приложении ??
                telegram.sendMessage(id, 'Время авторизации истекло. Повторите попытку. Если ошибка повторяется напишите @dlyakin')
            }

            var telegramUser = await models.TelegramUser.findOne({
                where: {
                    telegramId: id,
                    userId: user_id
                }
            })

            if (telegramUser) {
                telegramUser.auth_date = auth_date
                telegramUser.first_name = first_name
                telegramUser.hash = hash
                telegramUser.last_name = last_name
                telegramUser.username = username
                await telegramUser.save()
            } else {
                telegramUser = await models.TelegramUser.create({
                    telegramId: id,
                    auth_date,
                    first_name,
                    hash,
                    last_name,
                    username,
                    userId: user_id
                })
            }

            telegram.sendMessage(id, 'Добро пожаловать в клуб!\n'
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

            //TODO куда вести в приложении ??

            return res.redirect(`${config.get('clientUrl')}/tglink_ok`)
        } catch (error) {
            console.log("Ошибка auth.routes /linktg: ", error)
            console.log("Ошибка привязки телеграм: ", `user_id: ${user_id}, id: ${id}, first_name: ${first_name}, last_name: ${last_name}, username: ${username}`)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router
