const jwt = require('jsonwebtoken')
const config = require('config')
const { Op } = require('sequelize')
const models = require('../models')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {

        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded

        console.log(req.originalUrl)
        if (!req.originalUrl.includes('/api/plan/')) {
            const existingPay = await models.Pay.findOne({
                where: {
                    userId: decoded.userId,
                    paidTo: { [Op.gte]: new Date() }
                }
            })
            if (!existingPay) {
                return res.status(402).json({ message: 'Необходима оплата' })
            }
        }

        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Нет авторизации', error })
    }
}