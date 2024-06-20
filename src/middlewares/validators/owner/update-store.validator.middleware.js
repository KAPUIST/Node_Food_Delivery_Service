import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { USERS_CONS } from '../../../constants/users.constant.js';

export const updateStoreValidator = async (req, res, next) => {
    try {
        const updateStoreSchema = Joi.object({
            name: Joi.string().messages({
                'string.base': MESSAGES.OWNER.COMMON.NAME.BASE,
            }),
            city: Joi.string().messages({
                'string.base': MESSAGES.OWNER.COMMON.CITY.BASE,
            }),
            address: Joi.string().messages({
                'string.base': MESSAGES.OWNER.COMMON.ADDRESS.BASE,
            }),
            cuisineType: Joi.string()
                .valid(...Object.values(USERS_CONS.CUISINE_TYPE))
                .required()
                .messages({
                    'string.base': MESSAGES.OWNER.COMMON.CUISINE_TYPE.BASE,
                    'any.only': MESSAGES.OWNER.COMMON.CUISINE_TYPE.INVALID_CUISINE_TYPE,
                }),
        });
        await updateStoreSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
