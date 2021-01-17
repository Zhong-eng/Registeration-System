const Joi = require('joi')

module.exports.courseSchema = Joi.object({
    Course: Joi.object({
        name: Joi.string().required(),
        credits: Joi.number().required().min(0),
        description: Joi.string().required(),
        capacity: Joi.number().required()
    }).required()
})

module.exports.userSchema = Joi.object({
    Course: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        occupation: Joi.string().required(),
    }).required()
})

