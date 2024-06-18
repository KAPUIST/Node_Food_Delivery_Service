import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { AUTH_CONS } from '../../constants/auth.constant.js';

export const signUpValidator = async (req, res, next) => {
    try {
        const signUpSchema = Joi.object({
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
            passwordCheck: Joi.string()
                .min(AUTH_CONS.PASSWORD_MIN_LENGTH)
                .required()
                .valid(Joi.ref('password'))
                .messages({
                    'string.base': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.BASE,
                    'string.min': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.MIN,
                    'string.empty': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED,
                    'any.required': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED,
                    'any.only': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD,
                }),
            role: Joi.string()
                .required()
                .valid(...Object.values(AUTH_CONS.ROLE))
                .messages({
                    'string.base': MESSAGES.AUTH.COMMON.PASSWORD.BASE,
                    'string.empty': MESSAGES.AUTH.COMMON.ROLE.REQUIRED,
                    'any.required': MESSAGES.AUTH.COMMON.ROLE.REQUIRED,
                    'any.only': MESSAGES.AUTH.COMMON.ROLE.INVALID_ROLE,
                }),
            city: Joi.string().required().messages({
                'string.base': MESSAGES.AUTH.COMMON.CITY.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.CITY.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.CITY.REQUIRED,
            }),
            address: Joi.string().required().messages({
                'string.base': MESSAGES.AUTH.COMMON.ADDRESS.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.ADDRESS.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.ADDRESS.REQUIRED,
            }),
            name: Joi.string().required().messages({
                'string.base': MESSAGES.AUTH.COMMON.NAME.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.NAME.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.NAME.REQUIRED,
            }),
            phoneNumber: Joi.string().required().messages({
                'string.base': MESSAGES.AUTH.COMMON.PHONE_NUMBER.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.PHONE_NUMBER.BASE,
                'any.required': MESSAGES.AUTH.COMMON.PHONE_NUMBER.BASE,
            }),
            point: Joi.number().required().messages({
                'number.base': MESSAGES.AUTH.COMMON.POINT.BASE,
                'number.empty': MESSAGES.AUTH.COMMON.POINT.BASE,
                'any.required': MESSAGES.AUTH.COMMON.POINT.BASE,
            }),

            verificationCode: Joi.number().required().messages({
                'number.base': MESSAGES.AUTH.COMMON.VERIFICATION_CODE.BASE,
                'number.empty': MESSAGES.AUTH.COMMON.VERIFICATION_CODE.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.VERIFICATION_CODE.REQUIRED,
            }),
        });
        await signUpSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
