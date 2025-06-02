import Joi from 'joi'

export const signupValidation = (data) => {
    const signupSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email({ tlds: { allow: false } }).pattern(/@gmail\.com$/).required().messages({"string.pattern.base" : "Please Enter a Valid Email"}),
        password: Joi.string().min(5).max(20).required(),
    })

    return signupSchema.validate(data)
}


export const loginValidation = (data) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(20).required(),
    })

    return loginSchema.validate(data)
}