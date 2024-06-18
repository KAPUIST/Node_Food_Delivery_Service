import { MenusRepository } from '../repositories/menus.repository.js'
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class MenusService {
    menusRepository = new MenusRepository();

    createMenu = async (restaurantId, name, price, ownerId) => {
        const data = await this.menusRepository.createMenu({
            restaurantId, name, price
        });

        const restaurant = await this.menusRepository.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== ownerId) {
            throw new HttpError.Forbidden(MESSAGES.AUTH.FORBIDDEN);
        }

        return data;
    };

    getManyMenus = async ({ restaurantId }) => {
        const data = await this.menusRepository.getManyMenus({ restaurantId });

        return data;
    };

    getMenu = async ({ id, restaurantId}) => {
        const data = await this.menusRepository.getManyMenus({ id, restaurantId });

        if(!data) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }

        return data;
    }

    updateMenu = async ({ id, restaurantId, name, price, ownerId }) => {
        const existedMenu = await this.menusRepository.getMenu({ menuId: id, restaurantId });

        if (!existedMenu) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }

        const restaurant = await this.menusRepository.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== ownerId) {
            throw new HttpError.Forbidden(MESSAGES.AUTH.FORBIDDEN);
        }

        const data = await this.menusRepository.updateMenu({
            id, restaurantId, name, price
        });

        return data;
    };

    deleteMenu = async ({ id, restaurantId, ownerId }) => {
        const existedMenu = await this.menusRepository.getMenu({ menuId: id, restaurantId });

        if (!existedMenu) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }

        const restaurant = await this.menusRepository.getRestaurantById(restaurantId);


        if (restaurant.ownerId !== ownerId) {
            throw new HttpError.Forbidden(MESSAGES.AUTH.FORBIDDEN);
        }

        const data = await this.menusRepository.deleteMenu({ id, restaurantId });

        return data;
    };
}
