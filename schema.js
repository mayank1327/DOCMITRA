const Joi = require("joi");

module.exports.userSchema = Joi.object({
    listing : Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        gender: Joi.number().required().min(0),
        state: Joi.string().required(),
        mobileno: Joi.number().required(),
        password: Joi.string().allow("",null),
    })
});








