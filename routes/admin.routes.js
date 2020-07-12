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
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router