import * as _Joi from 'joi';

const Joi = _Joi.default;

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(5).max(15).required(),
    email: Joi.string().max(99).email().required(),
    password: Joi.string().alphanum().min(8).max(15).required()
})

const loginSchema = Joi.object({
    email: Joi.string().max(99).email().required(),
    password: Joi.string().alphanum().min(8).max(15).required()
})

export { registerSchema, loginSchema }