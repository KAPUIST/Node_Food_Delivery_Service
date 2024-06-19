import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { REVIEWS_CONS } from '../../../constants/reviews.constant.js';

export const updateReviewValidator = async (req, res, next) => {
    try {
        const reviewIdSchema = Joi.object({
            reviewId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.REVIEW.COMMON.REVIEW_ID.BASE,
                'number.integer': MESSAGES.REVIEW.COMMON.REVIEW_ID.BASE,
                'number.empty': MESSAGES.REVIEW.COMMON.REVIEW_ID.REQUIRED,
                'any.required': MESSAGES.REVIEW.COMMON.REVIEW_ID.REQUIRED,
            }),
        });
        const updateReviewSchema = Joi.object({
            rating: Joi.number()
                .integer()
                .valid(...Object.values(REVIEWS_CONS.RATINGS))
                .messages({
                    'number.base': MESSAGES.REVIEW.RATING.BASE,
                    'number.integer': MESSAGES.REVIEW.RATING.BASE,
                    'any.only': MESSAGES.REVIEW.RATING.INVALID_RATING,
                }),
            comment: Joi.string().messages({
                'string.base': MESSAGES.REVIEW.COMMON.COMMENT.BASE,
            }),
        });
        await reviewIdSchema.validateAsync(req.params);
        await updateReviewSchema.validateAsync(req.body);

        next();
    } catch (err) {
        next(err);
    }
};
