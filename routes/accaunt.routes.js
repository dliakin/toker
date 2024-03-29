const { Router } = require('express')
const TikTokScraper = require('tiktok-scraper')
var moment = require('moment-timezone')
const config = require('config')
const models = require('../models')
const auth = require('../middleware/auth.middleware')
const router = Router()
const { where, fn, col, Op } = require('sequelize');

router.get(
    '/getVideoDates',
    auth,
    async (req, res) => {
        try {
            console.log(req.user.userId)
            const user = await models.User.findOne({
                where: {
                    id: req.user.userId,
                }
            })

            const videoDates = await models.AccauntVideo.findAll({
                attributes: ['createTime'],
                where: {
                    accauntId: user.defaultAccauntId,
                }
            })

            var return_data = []
            videoDates.forEach(video => {
                return_data.push(new Date(video.createTime.setHours(0, 0, 0, 0)).getTime())
            });

            res.json(return_data)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.post(
    '/add',
    auth,
    async (req, res) => {
        try {
            const { uniqueId } = req.body

            var accaunt = await models.Accaunt.findOne({
                where: {
                    uniqueId
                }
            })

            if (!accaunt) {
                const newAccauntData = await TikTokScraper.getUserProfileInfo(uniqueId, { proxy: config.get('proxy') });
                accaunt = await models.Accaunt.create({
                    accauntId: newAccauntData.userId,
                    uniqueId: newAccauntData.uniqueId,
                    nickName: newAccauntData.nickName,
                    signature: newAccauntData.signature,
                    cover: newAccauntData.covers[0],
                    verified: newAccauntData.verified,
                    active: 1
                })
                accauntData = await models.AccauntData.create({
                    accauntId: accaunt.id,
                    following: newAccauntData.following,
                    fans: newAccauntData.fans,
                    heart: newAccauntData.heart,
                    video: newAccauntData.video,
                    digg: newAccauntData.digg,
                })
            }

            var userAccaunt = await models.UserAccaunt.findOne({
                where: {
                    userId: req.user.userId,
                    accauntId: accaunt.id
                }
            })

            if (userAccaunt) {
                return res.status(200).json(null)
            }

            const user = await models.User.findOne({
                where: {
                    id: req.user.userId
                }
            })

            user.addAccaunt(accaunt, { through: 'UserAccaunt' })

            res.status(201).json({ accaunt })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/',
    auth,
    async (req, res) => {
        try {
            const accaunts = await models.Accaunt.findAll({
                attributes: ['id', 'accauntId', 'uniqueId', 'nickName', 'signature', 'cover', 'verified'],
                include: [{
                    attributes: [],
                    model: models.User,
                    where: {
                        id: req.user.userId
                    }
                }]
            })
            res.json(accaunts)
        } catch (error) {
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/:id',
    auth,
    async (req, res) => {
        try {
            const accaunt = await models.Accaunt.findOne({
                raw: true,
                include: [{
                    attributes: ['goal', 'updatedAt'],
                    model: models.UserAccaunt,
                    as: 'accauntExtra',
                    where: {
                        userId: req.user.userId,
                        accauntId: req.params.id,
                    }
                }]
            })
            if (!accaunt) {
                return res.status(404).json({ message: `Аккаунт не найден` })
            }

            var newAccauntData = null
            try {
                newAccauntData = await TikTokScraper.getUserProfileInfo(accaunt.uniqueId, { proxy: config.get('proxy') })
            } catch (e) {
                console.error("TikTokScraper Error:", e)
            }

            const accauntData = await models.AccauntData.findAll({
                attributes: ['fans', 'createdAt'],
                where: {
                    accauntId: req.params.id,
                },
                order: [
                    ['createdAt', 'DESC'],
                ]
            })

            if (newAccauntData) {
                accaunt.fans = newAccauntData.fans
                accaunt.heart = newAccauntData.heart
            } else {
                accaunt.fans = accauntData[0].dataValues.fans
                accaunt.heart = accauntData[0].dataValues.heart
            }

            var return_data = []
            var goal_start_fans = accaunt.fans

            accauntData.forEach((obj, index, array) => {
                var created_at = obj.dataValues.createdAt
                var fans = obj.dataValues.fans
                var delta = 0
                if (index + 1 !== array.length) {
                    delta = obj.dataValues.fans - array[index + 1].dataValues.fans
                }

                if (moment(accaunt['accauntExtra.updatedAt']).format('YYYY-MM-DD HH') === moment(created_at).format('YYYY-MM-DD HH')) {
                    goal_start_fans = fans
                }

                return_data.push({ date: moment(created_at).format('YYYY-MM-DD HH:00'), fans, delta })

            })

            if (accaunt['accauntExtra.goal']) {
                accaunt['accauntExtra.goal_start_fans'] = goal_start_fans
            }

            accaunt.data = return_data
            res.json(accaunt)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/find/:username',
    async (req, res) => {
        try {
            const accaunt = await TikTokScraper.getUserProfileInfo(req.params.username, { proxy: config.get('proxy') });
            res.json(accaunt)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.post(
    '/setGoal',
    auth,
    async (req, res) => {
        try {
            const { id, goal } = req.body

            var userAccaunt = await models.UserAccaunt.findOne({
                where: {
                    accauntId: id,
                    userId: req.user.userId

                }
            })
            userAccaunt.goal = goal
            await userAccaunt.save()

            var accauntData = await models.AccauntData.findOne({
                where: {
                    accauntId: id
                }
                , order: [
                    ['createdAt', 'DESC'],
                ],
            })

            const goal_start_fans = accauntData.fans

            res.status(201).json({ goal_start_fans, goal: userAccaunt.goal })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.delete(
    '/delete/:id',
    auth,
    async (req, res) => {
        try {

            var userAccaunt = await models.UserAccaunt.findOne({
                where: {
                    userId: req.user.userId,
                    accauntId: req.params.id
                }
            })
            await userAccaunt.destroy();
            res.json({ message: `Пользователь удалён` })
        } catch (error) {
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })





module.exports = router