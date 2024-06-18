import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const searchRestaurantsValidator = async (req, res, next) => {
    try {
        const searchRestaurantsSchema = Joi.object({
            keyword: Joi.string().messages({
                'string.base': MESSAGES.SEARCH.COMMON.BASE,
            }),
        });
        await searchRestaurantsSchema.validateAsync(req.query);
        next();
    } catch (err) {
        next(err);
    }
};
