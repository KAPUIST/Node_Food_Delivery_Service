import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const deleteReviewValidator = async (req, res, next) => {
    try {
        const deleteReviewSchema = Joi.object({
            reviewId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.REVIEW.COMMON.REVIEW_ID.BASE,
                'number.integer': MESSAGES.REVIEW.COMMON.REVIEW_ID.BASE,
                'number.empty': MESSAGES.REVIEW.COMMON.REVIEW_ID.REQUIRED,
                'any.required': MESSAGES.REVIEW.COMMON.REVIEW_ID.REQUIRED,
            }),
        });
        await deleteReviewSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
