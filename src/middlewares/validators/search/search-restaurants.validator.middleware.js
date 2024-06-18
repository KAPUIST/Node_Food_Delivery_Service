import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const searchRestaurantsValidator = async (req, res, next) => {
    try {
        const searchRestaurantsSchema = Joi.object({
            keyword: Joi.string().required().messages({
                'string.base': MESSAGES.SEARCH.COMMON.BASE,
                'string.empty': MESSAGES.SEARCH.COMMON.KEYWORD,
                'any.required': MESSAGES.SEARCH.COMMON.KEYWORD,
            }),
        });
        await searchRestaurantsSchema.validateAsync(req.query);
        next();
    } catch (err) {
        next(err);
    }
};
