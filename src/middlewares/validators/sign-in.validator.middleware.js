import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { AUTH_CONS } from '../../constants/auth.constant.js';

export const signInValidator = async (req, res, next) => {
    try {
        const signInSchema = Joi.object({
            email: Joi.string()
                .email({
                    minDomainSegments: AUTH_CONS.MIN_DOMAIN_SEGMENTS,
                    tlds: { allow: AUTH_CONS.TLDS },
                })
                .required()
                .messages({
                    'string.base': MESSAGES.AUTH.COMMON.EMAIL.BASE,
                    'string.empty': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
                    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
                    'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
                }),
            password: Joi.string().min(AUTH_CONS.PASSWORD_MIN_LENGTH).required().messages({
                'string.base': MESSAGES.AUTH.COMMON.PASSWORD.BASE,
                'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN,
                'string.empty': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
            }),
        });
        await signInSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
