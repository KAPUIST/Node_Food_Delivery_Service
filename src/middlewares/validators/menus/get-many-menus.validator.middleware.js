import Joi from 'joi';
import { MESSAGES } from '../../../constants/message.constant.js';
import { MENUS_CONS } from '../../../constants/menus.constant.js';

export const getManyMenuValidator = async (req, res, next) => {
    try {
        const getManyMenusSchema = Joi.object({
            sort: Joi.valid(...Object.values(MENUS_CONS.ORDER_BY)).messages({
                'any.only': MESSAGES.MENUS.COMMON.SORT.INVALID_RATING,
            }),
        });
        await getManyMenusSchema.validateAsync(req.query);
        next();
    } catch (err) {
        next(err);
    }
};
