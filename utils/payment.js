const config = require('config')
const r2 = require('r2')
const models = require('../models')
const { Op } = require('sequelize')

const createPay = async (plan_id, user_id, coupon = null, fee = false) => {

    const prefix = `toker${process.env.NODE_ENV}`

    const plan = await models.Plan.findOne({
        where: {
            id: plan_id
        }
    })

    const user = await models.User.findOne({
        where: {
            id: user_id
        }
    })

    const pay = await models.Pay.create({
        userId: user_id,
        planId: plan.id
    })

    if (coupon === "lastchance") {
        plan.price = plan.price - 100 * plan.duration
    }

    if (coupon === "SJDHjiNXUIXNnndU") {
        plan.price = plan.price - 989 * plan.duration
    }

    if (coupon == "5465") {
        plan.price = plan.price - 100 * plan.duration
    }

    //TODO Вынести это условие в роуты
    const existPay = await models.Pay.findOne({
        where: {
            userId: user_id,
            active: {
                [Op.not]: null
            }
        }
    })

    if (fee || !existPay) {
        plan.price = plan.price + plan.fee
    }

    if (plan.price < 1) { plan.price = 1 }

    const url = `https://shipe.ru/chat/pay_travel.php?key=${config.get("tinkoffKey")}&func=gUP&mail=${user.email}&id=${prefix}_${pay.id}_${plan.id}&summ=${plan.price * 100}&lang=ru`
    const dataText = await r2(url).text
    const data = JSON.parse(dataText)
    pay.paymentid = data.PaymentId
    pay.save()

    return data.paymentUrl
}

module.exports = createPay