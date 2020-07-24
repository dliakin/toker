const { Router } = require('express')
const { QueryTypes } = require('sequelize')
var moment = require('moment-timezone')
const { fn, col } = require('sequelize')
const models = require('../models')
const auth = require('../middleware/auth.middleware')
const partner = require('../middleware/partner.middleware')

const router = Router()

router.get(
    '/pays',
    auth,
    partner,
    async (req, res) => {
        try {
            var partner = await models.Partner.findAll({
                include: [{
                    model: models.PartnerPay,
                    include: [{
                        model: models.Pay,
                        attributes: [
                            'id',
                            [fn('date_format', col('PartnerPays->Pay.createdAt'), '%Y-%m-%d'), 'createdAt'],
                            [fn('date_format', col('PartnerPays->Pay.paidTo'), '%Y-%m-%d'), 'paidTo'],
                            'realSum',
                            'active',
                            'realSum'
                        ],
                        include: [
                            {
                                model: models.User,

                            }
                        ]
                    }]
                }],
                where: {
                    userId: req.user.userId,
                },
                order: [
                    ['PartnerPays', 'createdAt', 'DESC'],
                ],
            })

            var totalPaidOutSum = 0
            var data = []
            partner[0].PartnerPays.forEach(pay => {
                var utm = {}
                var from = null

                if (pay.Pay.User.utm) {
                    utm = JSON.parse(pay.Pay.User.utm)
                }
                if (utm.from) {
                    from = utm.from
                }
                const id = pay.id
                const email = pay.Pay.User.email
                const paidOut = pay.paidOut
                const date = pay.Pay.createdAt
                const realSum = pay.Pay.realSum
                const paidOutSum = realSum * partner[0].percent / 100
                if (!paidOut) {
                    totalPaidOutSum += paidOutSum
                }
                data.push({ id, email, paidOut, date, realSum, paidOutSum, from })
            })
            res.json({ data, totalPaidOutSum })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router