const jwt = require('jsonwebtoken')
const config = require('config')
const { Op } = require('sequelize')
const models = require('../models')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        var partner = await models.Partner.findOne({
            where: {
                userId: req.user.userId,
            }
        })

        if (!partner) {
            res.status(403).json({ message: 'Доступ запрещён', error })
        }

        next()

    } catch (error) {
        console.log(error)
        res.status(403).json({ message: 'Доступ запрещён', error })
    }
}