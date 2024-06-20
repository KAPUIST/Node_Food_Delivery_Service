import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { MENUS_CONS } from '../constants/menus.constant.js';

export class MenusController {
    constructor(menusService) {
        this.menusService = menusService;
    }

    createMenu = async (req, res, next) => {
        try {
            const ownerId = req.user.id; // 인증된 사장님의 ID

            const { name, price } = req.body;
            const createdMenu = await this.menusService.createMenu(name, price, ownerId);

            return res.status(HTTP_STATUS.CREATED).json({ data: createdMenu, message: MESSAGES.MENU.CREATED.SUCCEED });
        } catch (error) {
            next(error);
        }
    };

    getManyMenus = async (req, res, next) => {
        try {
            let { sort } = req.query;
            sort = sort?.toLowerCase();

            if (sort !== MENUS_CONS.ORDER_BY.DESC && sort !== MENUS_CONS.ORDER_BY.ASC) {
                sort = MENUS_CONS.ORDER_BY.DESC;
            }
            console.log(sort);

            const restaurantId = +req.params.restaurantId;
            const data = await this.menusService.getManyMenus({ restaurantId, sort });
            return res.status(HTTP_STATUS.OK).json({ data });
        } catch (error) {
            next(error);
        }
    };

    getMenu = async (req, res, next) => {
        try {
            const { restaurantId } = req.params;
            const { id } = req.body;

            const data = await this.menusService.getMenu({ id, restaurantId });

            return res.status(HTTP_STATUS.OK).json({ data });
        } catch (error) {
            next(error);
        }
    };

    updateMenu = async (req, res, next) => {
        try {
            const ownerId = req.user.id; // 인증된 사장님의 ID
            const menuId = +req.params.menuId;
            const { name, price } = req.body;

            const data = await this.menusService.updateMenu({
                menuId,
                name,
                price,
                ownerId,
            });

            return res.status(HTTP_STATUS.OK).json({ data, message: MESSAGES.MENU.UPDATE.SUCCEED });
        } catch (error) {
            next(error);
        }
    };

    deleteMenu = async (req, res, next) => {
        try {
            const ownerId = req.user.id; // 인증된 사장님의 ID
            const menuId = +req.params.menuId;

            const data = await this.menusService.deleteMenu({ menuId, ownerId });

            return res.status(HTTP_STATUS.OK).json({ data, message: MESSAGES.MENU.DELETE.SUCCEED });
        } catch (error) {
            next(error);
        }
    };
}
