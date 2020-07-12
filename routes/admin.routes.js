const { Router } = require('express')
const { QueryTypes } = require('sequelize')
var moment = require('moment-timezone')
const { fn, col } = require('sequelize')
const models = require('../models')
const auth = require('../middleware/auth.middleware')
const admin = require('../middleware/admin.middleware')

const router = Router()

router.get(
    '/dashboard',
    auth,
    admin,
    async (req, res) => {
        try {
            var users = await models.User.findAll({
                attributes: ['id', 'email', 'tel', 'telegramName', 'utm']
                , include: [
                    {
                        model: models.Pay,
                        attributes: [
                            'id',
                            [fn('date_format', col('Pays.createdAt'), '%Y-%m-%d'), 'createdAt'],
                            [fn('date_format', col('Pays.paidTo'), '%Y-%m-%d'), 'paidTo'],
                            'realSum',
                            'active'
                        ]

                    }
                    , {
                        model: models.TelegramUser,
                        attributes: ['username']
                    }
                ]
            })

            var data = []
            users.forEach(user => {
                const id = user.id
                const email = user.email

                const activePay = user.Pays.filter(obj => { return obj.active === true })
                const paidTo = (activePay[0] && activePay[0].paidTo) || `заявка`

                const tel = user.tel
                const telegramUser = (user.TelegramUser && user.TelegramUser.username) || user.telegramName
                const telegramCotected = !!user.TelegramUser
                const utm = user.utm
                data.push({ id, email, paidTo, tel, telegramUser, telegramCotected, utm, pays: user.Pays })
            })

            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router