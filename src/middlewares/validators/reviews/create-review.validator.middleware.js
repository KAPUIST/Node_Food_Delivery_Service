import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { REVIEWS_CONS } from '../../../constants/reviews.constant.js';

export const createReviewValidator = async (req, res, next) => {
    try {
        const orderIdSchema = Joi.object({
            orderId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.REVIEW.COMMON.ORDER_ID.BASE,
                'number.integer': MESSAGES.REVIEW.COMMON.ORDER_ID.BASE,
                'number.empty': MESSAGES.REVIEW.COMMON.ORDER_ID.REQUIRED,
                'any.required': MESSAGES.REVIEW.COMMON.ORDER_ID.REQUIRED,
            }),
        });
        const createReviewSchema = Joi.object({
            rating: Joi.number()
                .integer()
                .valid(...Object.values(REVIEWS_CONS.RATINGS))
                .required()
                .messages({
                    'number.base': MESSAGES.REVIEW.RATING.BASE,
                    'number.integer': MESSAGES.REVIEW.RATING.BASE,
                    'number.empty': MESSAGES.REVIEW.RATING.REQUIRED,
                    'any.required': MESSAGES.REVIEW.RATING.REQUIRED,
                    'any.only': MESSAGES.REVIEW.RATING.INVALID_RATING,
                }),
            comment: Joi.string().required().messages({
                'string.base': MESSAGES.REVIEW.COMMON.COMMENT.BASE,
                'any.required': MESSAGES.REVIEW.COMMON.COMMENT.REQUIRED,
                'string.empty': MESSAGES.REVIEW.COMMON.COMMENT.REQUIRED,
            }),
        });
        await orderIdSchema.validateAsync(req.params);
        await createReviewSchema.validateAsync(req.body);

        next();
    } catch (err) {
        next(err);
    }
};
