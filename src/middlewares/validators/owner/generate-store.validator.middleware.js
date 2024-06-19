import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { USERS_CONS } from '../../../constants/users.constant.js';

export const generateStoreValidator = async (req, res, next) => {
    try {
        const generateStoreSchema = Joi.object({
            name: Joi.string().required().messages({
                'string.base': MESSAGES.OWNER.COMMON.NAME.BASE,
                'string.empty': MESSAGES.OWNER.COMMON.NAME.REQUIRED,
                'any.required': MESSAGES.OWNER.COMMON.NAME.REQUIRED,
            }),
            city: Joi.string().required().messages({
                'string.base': MESSAGES.OWNER.COMMON.CITY.BASE,
                'string.empty': MESSAGES.OWNER.COMMON.CITY.REQUIRED,
                'any.required': MESSAGES.OWNER.COMMON.CITY.REQUIRED,
            }),
            address: Joi.string().required().messages({
                'string.base': MESSAGES.OWNER.COMMON.ADDRESS.BASE,
                'string.empty': MESSAGES.OWNER.COMMON.ADDRESS.REQUIRED,
                'any.required': MESSAGES.OWNER.COMMON.ADDRESS.REQUIRED,
            }),
            cuisineType: Joi.string()
                .valid(...Object.values(USERS_CONS.CUISINE_TYPE))
                .required()
                .messages({
                    'string.base': MESSAGES.OWNER.COMMON.CUISINE_TYPE.BASE,
                    'string.empty': MESSAGES.OWNER.COMMON.CUISINE_TYPE.REQUIRED,
                    'any.required': MESSAGES.OWNER.COMMON.CUISINE_TYPE.REQUIRED,
                    'any.only': MESSAGES.OWNER.COMMON.CUISINE_TYPE.INVALID_CUISINE_TYPE,
                }),
        });
        await generateStoreSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
