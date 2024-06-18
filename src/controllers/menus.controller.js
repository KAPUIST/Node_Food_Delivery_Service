import { MenusService } from '../services/menus.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class MenusController {
    menusService = new MenusService();

    createMenu = async (req, res, next) => {
        try {
            const ownerId = req.user.id; // 인증된 사장님의 ID
            const { restaurantId } = req.params;
            const { name, price } = req.body;
            const createdMenu = await this.menusService.createMenu(
                restaurantId,
                name,
                price,
                ownerId,
            );

            return res.status(HTTP_STATUS.CREATED).json({ data: createdMenu, message: MESSAGES.MENU.CREATED });
        } catch (err) {
            next(err);
        }
    };

    getMenus = async (req, res, next) => {
        try {
            let { sort } = req.query;
            sort = sort?.toLowerCase();

            if (sort !== 'desc' && sort !== 'asc') {
                sort = 'desc';
            }

            const { restaurantId } = req.params;
            const data = await this.menusService.getManyMenus({ restaurantId, sort });
            return res.status(HTTP_STATUS.OK).json({ data });
        } catch (err) {
            next(err);
        }
    };

    updateMenu = async (req, res, next) => {
        try {
            const ownerId = req.user.id; // 인증된 사장님의 ID
            const { restaurantId, id } = req.params;
            const { name, price } = req.body;

            const data = await this.menusService.updateMenu({
                id,
                restaurantId,
                name,
                price,
                ownerId,
            });

            return res.status(HTTP_STATUS.OK).json({ data, message: MESSAGES.MENU.UPDATE.SUCCEED });
        } catch (err) {
            next(err);
        }
    };

    deleteMenu = async (req, res, next) => {
        try {
            const ownerId = req.user.id; // 인증된 사장님의 ID
            const { restaurantId, id } = req.params;

            const data = await this.menusService.deleteMenu({ id, restaurantId, ownerId });

            return res.status(HTTP_STATUS.OK).json({ data, message: MESSAGES.MENU.DELETE.SUCCEED });
        } catch (err) {
            next(err);
        }
    };
}
