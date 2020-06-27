const { Router } = require('express')
const models = require('../models')
const { QueryTypes } = require('sequelize')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get(
    '/',
    auth,
    async (req, res) => {
        try {

            const user = await models.User.findOne({
                where: {
                    id: req.user.userId
                }
            })

            const roles = await models.sequelize.query(`WITH RECURSIVE tree (id, parent_id) AS (
                SELECT id,includeId FROM Roles WHERE id=${user.roleId}
                UNION ALL
                SELECT r.id,r.includeId FROM Roles r
                JOIN tree t ON r.id = t.parent_id
            )
            SELECT id FROM tree`, { type: QueryTypes.SELECT })

            rolesArray = roles.map(function (obj) {
                return obj.id;
            });

            const news = await models.New.findAll({
                where: {
                    roleId: rolesArray
                }
            })

            res.json(news)
        } catch (error) {
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

router.get(
    '/:id',
    auth,
    async (req, res) => {
        try {

            const user = await models.User.findOne({
                where: {
                    id: req.user.userId
                }
            })

            const roles = await models.sequelize.query(`WITH RECURSIVE tree (id, parent_id) AS (
                    SELECT id,includeId FROM Roles WHERE id=${user.roleId}
                    UNION ALL
                    SELECT r.id,r.includeId FROM Roles r
                    JOIN tree t ON r.id = t.parent_id
                )
                SELECT id FROM tree`, { type: QueryTypes.SELECT })

            rolesArray = roles.map(function (obj) {
                return obj.id;
            });

            const newItem = await models.New.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    model: models.File
                }]
            })

            if (!newItem) {
                return res.status(404).json({ message: `Новость не найдена` })
            }

            if (!rolesArray.includes(newItem.roleId)) {
                return res.status(403).json({ message: `Доступ запрещён` })
            }

            res.json(newItem)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Что-то пошло не так, попробуйте снова` })
        }
    })

module.exports = router