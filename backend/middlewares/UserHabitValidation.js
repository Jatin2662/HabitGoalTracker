

const Joi = require('joi')

const habitValidation = (req, res, next) => {

    const schema = Joi.object({
        habit: Joi.string().min(2).max(100).required(),
        habitDescription: Joi.string().allow('').max(500),
        repeat: Joi.string().max(100).required(),
        custom_repeat: Joi.array().items(
            Joi.string().valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        ).optional(),
        startDate: Joi.date().iso().optional(),
        //     endDate: Joi.date().iso().optional().greater(Joi.ref('startDate')).messages({
        //   'date.greater': 'End date must be after start date'
        // }),
        endDate: Joi.alternatives().try(
            Joi.date().iso().min(Joi.ref('startDate')),
            Joi.valid(null)
        ).messages({
            'date.min': 'End date cannot be before start date'
        }),
        state: Joi.string().valid('active', 'suspended', 'archived').required(),
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad request", error, success: false })
    }
    next();
}


const updateHabitValidation = (req, res, next) => {

    const schema = Joi.object({
        habit: Joi.string().min(2).max(100),
        habitDescription: Joi.string().allow('').max(500),
        repeat: Joi.string().max(100),
        custom_repeat: Joi.array().items(
            Joi.string().valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        ).optional(),
        startDate: Joi.date().iso().optional(),
        //     endDate: Joi.date().iso().optional().greater(Joi.ref('startDate')).messages({
        //   'date.greater': 'End date must be after start date'
        // }),
        endDate: Joi.alternatives().try(
            Joi.date().iso().min(Joi.ref('startDate')),
            Joi.valid(null)
        ).messages({
            'date.min': 'End date cannot be before start date'
        }),
        state: Joi.string().valid('active', 'suspended', 'archived'),
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad request", error, success: false })
    }
    next();
}

const userSettingsValidation = (req, res, next)=>{

    const schema = Joi.object({
        firstName: Joi.string().min(2).max(100).optional(),
        lastName: Joi.string().min(2).max(100).optional(),
        theme: Joi.string().valid('light', 'dark').optional()
    });

    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).json({  message: "Bad request", error, success: false  })
    }
    next();
}

module.exports = {
    habitValidation,
    updateHabitValidation,
    userSettingsValidation
}