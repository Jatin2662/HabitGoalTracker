

const Joi = require('joi')

const mailContentValidation = (req, res, next) => {

    const schema = Joi.object({
        subject: Joi.string().min(5).required(),
        body: Joi.string().min(5).required(),
        end: Joi.string().min(5).required(),
        mailId : Joi.string().allow('').optional()
    })

    const { error } = schema.validate(req.body);

    if(error){
        console.log(error)
        return res.status(400).json({ message: "Bad request", error, success: false })
    }
    next();
}
module.exports = mailContentValidation;