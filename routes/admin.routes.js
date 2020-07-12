const { Router } = require('express')
const { QueryTypes } = require('sequelize')
var moment = require('moment-timezone')
const { Op } = require('sequelize')
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
                include: [
                    { model: models.Pay, }
                    ,{model: models.TelegramUser,}
                ]
            })
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router