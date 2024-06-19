import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { ORDER_VALIDATOR } from '../../../constants/orders.constant.js';

export const createOrderValidator = async (req, res, next) => {
    try {
        const orderItemSchema = Joi.object({
            menuId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.ORDER.COMMON.MENU_ID.BASE,
                'number.integer': MESSAGES.ORDER.COMMON.MENU_ID.BASE,
                'number.empty': MESSAGES.ORDER.COMMON.MENU_ID.REQUIRED,
                'any.required': MESSAGES.ORDER.COMMON.MENU_ID.REQUIRED,
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                'number.base': MESSAGES.ORDER.COMMON.QUANTITY.BASE,
                'number.integer': MESSAGES.ORDER.COMMON.QUANTITY.BASE,
                'number.empty': MESSAGES.ORDER.COMMON.QUANTITY.REQUIRED,
                'any.required': MESSAGES.ORDER.COMMON.QUANTITY.REQUIRED,
            }),
        });

        const createOrderSchema = Joi.object({
            orderItems: Joi.array().items(orderItemSchema).min(ORDER_VALIDATOR.ARRAY_MIN_LENGTH).required().messages({
                'number.base': MESSAGES.AUTH.COMMON.POINT.BASE,
                'number.integer': MESSAGES.AUTH.COMMON.POINT.BASE,
                'number.empty': MESSAGES.AUTH.COMMON.POINT.BASE,
                'any.required': MESSAGES.AUTH.COMMON.POINT.BASE,
            }),
            restaurantId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.ORDER.COMMON.RESTAURANT_ID.BASE,
                'number.integer': MESSAGES.ORDER.COMMON.RESTAURANT_ID.BASE,
                'number.empty': MESSAGES.ORDER.COMMON.RESTAURANT_ID.REQUIRED,
                'any.required': MESSAGES.ORDER.COMMON.RESTAURANT_ID.REQUIRED,
            }),
        });
        await createOrderSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
