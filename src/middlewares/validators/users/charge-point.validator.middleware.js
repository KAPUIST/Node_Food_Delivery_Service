import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const chargePointValidator = async (req, res, next) => {
    try {
        const chargePointSchema = Joi.object({
            point: Joi.number().integer().required().messages({
                'number.base': MESSAGES.USER.COMMON.POINT.BASE,
                'number.integer': MESSAGES.USER.COMMON.POINT.BASE,
                'number.empty': MESSAGES.USER.COMMON.POINT.REQUIRED,
                'any.required': MESSAGES.USER.COMMON.POINT.REQUIRED,
            }),
        });
        await chargePointSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
