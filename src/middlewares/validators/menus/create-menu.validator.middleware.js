import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const createMenuValidator = async (req, res, next) => {
    try {
        const createMenuSchema = Joi.object({
            name: Joi.string().required().messages({
                'string.base': MESSAGES.MENUS.COMMON.NAME.BASE,
                'any.required': MESSAGES.MENUS.COMMON.NAME.REQUIRED,
                'string.empty': MESSAGES.MENUS.COMMON.NAME.REQUIRED,
            }),
            price: Joi.number().integer().required().messages({
                'number.base': MESSAGES.MENUS.COMMON.PRICE.BASE,
                'number.integer': MESSAGES.MENUS.COMMON.PRICE.BASE,
                'number.empty': MESSAGES.MENUS.COMMON.PRICE.REQUIRED,
                'any.required': MESSAGES.MENUS.COMMON.PRICE.REQUIRED,
            }),
        });
        await createMenuSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
