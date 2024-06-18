import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { ORDER_VALIDATOR } from '../../../constants/orders.constant.js';

export const getAllOrdersValidator = async (req, res, next) => {
    try {
        const getAllOrdersSchema = Joi.object({
            status: Joi.string()
                .valid(...Object.values(ORDER_VALIDATOR.STATUS))
                .messages({
                    'string.base': MESSAGES.ORDER.COMMON.STATUS.BASE,
                    'any.only': MESSAGES.ORDER.COMMON.STATUS.INVALID_STATUS,
                }),
            restaurantId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.ORDER.COMMON.RESTAURANT_ID.BASE,
                'number.integer': MESSAGES.ORDER.COMMON.RESTAURANT_ID.BASE,
                'number.empty': MESSAGES.ORDER.COMMON.RESTAURANT_ID.REQUIRED,
                'any.required': MESSAGES.ORDER.COMMON.RESTAURANT_ID.REQUIRED,
            }),
        });
        await getAllOrdersSchema.validateAsync(req.query);
        next();
    } catch (err) {
        next(err);
    }
};
