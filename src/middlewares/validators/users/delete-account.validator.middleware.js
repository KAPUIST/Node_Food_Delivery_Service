import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { USERS_CONS } from '../../../constants/users.constant.js';

export const deleteAccountValidator = async (req, res, next) => {
    try {
        const deleteAccountSchema = Joi.object({
            password: Joi.string().min(USERS_CONS.PASSWORD_MIN_LENGTH).required().messages({
                'string.base': MESSAGES.USER.COMMON.PASSWORD.BASE,
                'string.min': MESSAGES.USER.COMMON.PASSWORD.MIN,
                'string.empty': MESSAGES.USER.COMMON.PASSWORD.REQUIRED,
                'any.required': MESSAGES.USER.COMMON.PASSWORD.REQUIRED,
            }),
        });
        await deleteAccountSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
