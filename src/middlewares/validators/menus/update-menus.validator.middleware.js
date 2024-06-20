import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const updateMenuValidator = async (req, res, next) => {
    try {
        const menuIdSchema = Joi.object({
            menuId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.MENUS.COMMON.MENU_ID.BASE,
                'number.integer': MESSAGES.MENUS.COMMON.MENU_ID.BASE,
                'number.empty': MESSAGES.MENUS.COMMON.MENU_ID.REQUIRED,
                'any.required': MESSAGES.MENUS.COMMON.MENU_ID.REQUIRED,
            }),
        });
        const updateMenuSchema = Joi.object({
            name: Joi.string().messages({
                'string.base': MESSAGES.MENUS.COMMON.NAME.BASE,
            }),
            price: Joi.number().integer().messages({
                'number.base': MESSAGES.MENUS.COMMON.PRICE.BASE,
                'number.integer': MESSAGES.MENUS.COMMON.PRICE.BASE,
            }),
        });
        await menuIdSchema.validateAsync(req.params);
        await updateMenuSchema.validateAsync(req.body);

        next();
    } catch (err) {
        next(err);
    }
};
