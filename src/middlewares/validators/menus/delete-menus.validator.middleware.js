import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';

export const deleteMenuValidator = async (req, res, next) => {
    try {
        const deleteMenuSchema = Joi.object({
            menuId: Joi.number().integer().required().messages({
                'number.base': MESSAGES.MENUS.COMMON.MENU_ID.BASE,
                'number.integer': MESSAGES.MENUS.COMMON.MENU_ID.BASE,
                'number.empty': MESSAGES.MENUS.COMMON.MENU_ID.REQUIRED,
                'any.required': MESSAGES.MENUS.COMMON.MENU_ID.REQUIRED,
            }),
        });
        await deleteMenuSchema.validateAsync(req.params);
        next();
    } catch (err) {
        next(err);
    }
};
