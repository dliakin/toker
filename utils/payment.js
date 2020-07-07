const config = require('config')
const r2 = require('r2')
const models = require('../models')

const createPay = async (plan_id, user_id) => {

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

    const url = `https://shipe.ru/chat/pay_travel.php?key=${config.get("tinkoffKey")}&func=gUP&mail=${user.email}&id=${prefix}_${pay.id}_${plan.id}&summ=${plan.price * 100}&lang=ru`

    const dataText = await r2(url).text
    const data = JSON.parse(dataText)
    pay.paymentid = data.PaymentId
    pay.save()

    return data.paymentUrl
}

module.exports = createPay