import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const restoreStoreValidator = async (req, res, next) => {
    try {
        const restoreStoreSchema = Joi.object({
            number: Joi.number().integer().required().messages({
                'number.base': MESSAGES.OWNER.COMMON.NUMBER.BASE,
                'number.integer': MESSAGES.OWNER.COMMON.NUMBER.BASE,
                'number.empty': MESSAGES.OWNER.COMMON.NUMBER.REQUIRED,
                'any.required': MESSAGES.OWNER.COMMON.NUMBER.REQUIRED,
            }),
        });
        await restoreStoreSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
