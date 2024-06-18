import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { ORDER_VALIDATOR } from '../../../constants/orders.constant.js';

export const updateOrderStatusValidator = async (req, res, next) => {
    try {
        const updateOrderStatusSchema = Joi.object({
            orderId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.ORDER.COMMON.ORDER_ID.BASE,
                'number.integer': MESSAGES.ORDER.COMMON.ORDER_ID.BASE,
                'number.empty': MESSAGES.ORDER.COMMON.ORDER_ID.REQUIRED,
                'any.required': MESSAGES.ORDER.COMMON.ORDER_ID.REQUIRED,
            }),
        });
        const getStatusSchema = Joi.object({
            status: Joi.string()
                .required()
                .valid(...Object.values(ORDER_VALIDATOR.STATUS))
                .messages({
                    'string.base': MESSAGES.ORDER.COMMON.STATUS.BASE,
                    'any.required': MESSAGES.ORDER.COMMON.STATUS.REQUIRED,
                    'string.empty': MESSAGES.ORDER.COMMON.STATUS.REQUIRED,
                    'any.only': MESSAGES.ORDER.COMMON.STATUS.INVALID_STATUS,
                }),
        });
        await updateOrderStatusSchema.validateAsync(req.params);
        await getStatusSchema.validateAsync(req.body);

        next();
    } catch (err) {
        next(err);
    }
};
