


const Joi = require('joi');


const signupValidation = (req, res, next)=>{

    const schema = Joi.object({
        firstName: Joi.string().min(2).max(100).required(),
        lastName: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(100).required(),
        theme: Joi.string().valid('light', 'dark')
    })

    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).json({ message: "Bad request" ,error })
    }
    next();
}


const loginValidation = (req, res, next)=>{

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(100).required()
    })

    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).json({ message: "Bad request", error })
    }
    next();
}

const emailVerificationValidation = (req, res, next)=>{

    const schema = Joi.object({
        email: Joi.string().email().required()
    })

    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).json({ message: "Bad request", error })
    }
    
    next();
}

const resetPasswordValidation = (req, res, next) => {
    
    const schema = Joi.object({
        password: Joi.string().min(3).max(100).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': "Password and Confirm password do not match.",
            'any.required': "Confirm password is required."
        }),
    });

    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).json({ message: error.details[0]?.message || "Bad request"})
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation,
    emailVerificationValidation,
    resetPasswordValidation
}