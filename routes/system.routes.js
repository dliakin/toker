const { Router } = require('express')
const { QueryTypes } = require('sequelize')
var moment = require('moment-timezone')
const { Op } = require('sequelize')
const models = require('../models')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.get(
    '/getBottomALert',
    auth,
    async (req, res) => {
        try {

            const telegramUser = await models.TelegramUser.findOne({
                where: {
                    userId: req.user.userId
                }
            })

            if (!telegramUser){
                return res.json({ type: "warning", message: `Привяжите Telegram`, action: { text: "Привязать", link: "/user" } })
            }

            const pay = await models.Pay.findOne({
                where: {
                    userId: req.user.userId,
                    paidTo: {
                        [Op.and]: [
                            { [Op.lte]: moment().add(7, 'days').toDate() },
                            { [Op.gte]: moment() }
                        ]
                    },
                    active: true
                }
            })

            if (pay) {
                const days = moment(pay.paidTo).diff(moment(), 'days')
                return res.json({ type: "info", message: `ОСТАЛОСЬ ДНЕЙ: ${days}`, action: { text: "Продлить со скидкой", link: "/plans/?coupon=lastchance" } })
            }

            res.json(null)

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router