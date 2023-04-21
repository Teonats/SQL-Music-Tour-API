const stages = require('express').Router();
const db = require('../models')
const { Stage, Event } = db
const { Op } = require("sequelize");


stages.get('/', async (req, res) => {
    try {
        const foundStages = await Stage.findAll({
            where: {
                stage_name: { [Op.like]: `%${req.query.stage_name ? req.query.stage_name : ''}%` }
            }
        })
        res.status(200).json(foundStages)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC BAND
stages.get('/:id', async (req,res) => {
    try {
        const foundStages = await Stage.findOne({
            where: { stage_name: req.params.name },
            include: {
                model: Event,
                as: 'events',
                through: {attributes: []}
            },
            order: [
                [{ model: Event, as: "events" }, 'date', 'ASC'],
            ]
        })
        res.status(200).json(foundStages)
    } catch (error) {
        res.status(500).json(error)
    }
});


// CREATE A BAND
stages.post('/', async (req, res) => {
    try {
        const newStages = await Stage.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new Stage',
            data: newStages
        })
    } catch (err) {
        res.status(500).json(err)
    }
})


// UPDATE A BAND
stages.put('/:id', async (req,res) => {
    try {
        const updateStages = await Stage.update(req.body, {
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updateStages} stage(s)`
        })
    } catch (error) {
        res.status(500).json(error)
    }
});

// DELETE A BAND
stages.delete('/:id', async (req,res) => {
    try {
        const deleteStages = await Stage.destroy({
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deleteStages} stage(s)`
        })
    } catch (error) {
        res.status(500).json(error)
    }
})


//EXPORT
module.exports = stages