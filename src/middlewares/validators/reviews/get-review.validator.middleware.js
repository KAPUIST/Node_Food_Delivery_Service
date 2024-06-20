import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { REVIEWS_CONS } from '../../../constants/reviews.constant.js';

export const getReviewValidator = async (req, res, next) => {
    try {
        const restaurantIdSchema = Joi.object({
            restaurantId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.BASE,
                'number.integer': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.BASE,
                'number.empty': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.REQUIRED,
                'any.required': MESSAGES.REVIEW.COMMON.RESTAURANT_ID.REQUIRED,
            }),
        });
        const getReviewSchema = Joi.object({
            orderBy: Joi.valid(...Object.values(REVIEWS_CONS.ORDER_BY)).messages({
                'any.only': MESSAGES.REVIEW.COMMON.ORDER_BY.INVALID_RATING,
            }),
        });
        await restaurantIdSchema.validateAsync(req.params);
        await getReviewSchema.validateAsync(req.query);

        next();
    } catch (err) {
        next(err);
    }
};
