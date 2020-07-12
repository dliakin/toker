const jwt = require('jsonwebtoken')
const config = require('config')
const { Op } = require('sequelize')
const models = require('../models')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        var user = await models.User.findOne({
            where: {
                id: req.user.userId,
            }
        })

        var role = await models.Role.findOne({
            where: {
                id: user.roleId,
            }
        })

        if (role.code !== 'admin') {
            res.status(403).json({ message: 'Доступ запрещён', error })
        }

        next()

    } catch (error) {
        console.log(error)
        res.status(403).json({ message: 'Доступ запрещён', error })
    }
}