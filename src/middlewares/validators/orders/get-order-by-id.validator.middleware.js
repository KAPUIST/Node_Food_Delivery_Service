import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const getOrderByIdValidator = async (req, res, next) => {
    try {
        const getOrderByIdSchema = Joi.object({
            orderId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.ORDER.COMMON.ORDER_ID.BASE,
                'number.integer': MESSAGES.ORDER.COMMON.ORDER_ID.BASE,
                'number.empty': MESSAGES.ORDER.COMMON.ORDER_ID.REQUIRED,
                'any.required': MESSAGES.ORDER.COMMON.ORDER_ID.REQUIRED,
            }),
        });
        await getOrderByIdSchema.validateAsync(req.params);
        next();
    } catch (err) {
        next(err);
    }
};
