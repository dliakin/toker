const { Router } = require('express')
const { QueryTypes } = require('sequelize')
var moment = require('moment-timezone')
const { fn, col, Op } = require('sequelize')
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

router.get(
    '/pays',
    auth,
    admin,
    async (req, res) => {
        try {
            var pays = await models.User.findAll({
                attributes: ['id', 'email', 'tel', 'telegramName', 'utm']
                , include: [
                    {
                        model: models.Pay,
                        attributes: [
                            'id',
                            [fn('date_format', col('Pays.createdAt'), '%Y-%m-%d'), 'createdAt'],
                            [fn('date_format', col('Pays.paidTo'), '%Y-%m-%d'), 'paidTo'],
                            'realSum',
                        ],
                        where: {
                            realSum: {
                                [Op.not]: null,
                            }
                        }
                    },
                    {
                        model: models.TelegramUser,
                        attributes: ['telegramId', 'username', 'first_name', 'last_name']
                    }

                ],
                order: [
                    [models.Pay, 'createdAt', 'DESC'],
                ],
                raw: true
            })

            var data = []
            // {
            //     [0]   id: 60,
            //     [0]   email: 'dlyakin@gmail.com',
            //     [0]   utm: '{}',
            //     [0]   'Pays.id': 658,
            //     [0]   'Pays.createdAt': '2020-07-17',
            //     [0]   'Pays.paidTo': '2020-08-19',
            //     [0]   'Pays.realSum': 1,
            //     [0]   'TelegramUser.username': ''
            //     [0] }
            pays.forEach(pay => {
                const id = pay.id
                const payId = pay['Pays.id']
                const email = pay.email
                const realSum = pay['Pays.realSum']
                const createdAt = pay['Pays.createdAt']
                const paidTo = pay['Pays.paidTo']
                var utm = {}
                var from = null
                var ref = null
                if (pay.utm) {
                    utm = JSON.parse(pay.utm)
                }
                if (utm.from) {
                    from = utm.from
                }
                if (utm.ref) {
                    ref = utm.ref
                }

                const tel = pay.tel

                const telegram = { username: pay['TelegramUser.username'], first_name: pay['TelegramUser.first_name'], last_name: pay['TelegramUser.last_name'] }
                const telegramCotected = !!pay['TelegramUser.telegramId']
                data.push({ id, payId, email, realSum, createdAt, paidTo, from, ref, tel, telegram, telegramName: [pay.telegramName], telegramCotected })
            })
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router