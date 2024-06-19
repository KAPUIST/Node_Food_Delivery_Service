import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const createMenuValidator = async (req, res, next) => {
    try {
        const restaurantIdSchema = Joi.object({
            restaurantId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.BASE,
                'number.integer': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.BASE,
                'number.empty': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.REQUIRED,
                'any.required': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.REQUIRED,
            }),
        });
        const createMenuSchema = Joi.object({
            name: Joi.string().required().messages({
                'string.base': MESSAGES.REVIEW.COMMON.NAME.BASE,
                'any.required': MESSAGES.REVIEW.COMMON.NAME.REQUIRED,
                'string.empty': MESSAGES.REVIEW.COMMON.NAME.REQUIRED,
            }),
            price: Joi.number().integer().required().messages({
                'number.base': MESSAGES.REVIEW.COMMON.PRICE.BASE,
                'number.integer': MESSAGES.REVIEW.COMMON.PRICE.BASE,
                'number.empty': MESSAGES.REVIEW.COMMON.PRICE.REQUIRED,
                'any.required': MESSAGES.REVIEW.COMMON.PRICE.REQUIRED,
            }),
        });
        await restaurantIdSchema.validateAsync(req.params);
        await createMenuSchema.validateAsync(req.body);

        next();
    } catch (err) {
        next(err);
    }
};
