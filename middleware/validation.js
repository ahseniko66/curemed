const Joi = require('joi');

exports.validateRegister = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

exports.validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

exports.validateDiagnose = (req, res, next) => {
    const schema = Joi.object({
        symptoms: Joi.string().min(3).max(500).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

exports.validateAppointment = (req, res, next) => {
    const schema = Joi.object({
        hospitalName: Joi.string().min(3).required(),
        age: Joi.number().integer().min(1).max(120).required(),
        gender: Joi.string().valid('Male', 'Female').required(),
        symptoms: Joi.string().optional()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};