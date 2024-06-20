import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class MenusService {
    constructor(menusRepository, restaurantRepository) {
        this.menusRepository = menusRepository;
        this.restaurantRepository = restaurantRepository;
    }

    createMenu = async (name, price, ownerId) => {
        //유저가 어떤 업장을 소유하고있는가?
        const restaurant = await this.restaurantRepository.findStore({ ownerId });
        if (!restaurant) {
            throw new HttpError.NotFound(MESSAGES.RESTAURANTS.NOT_ALLOW);
        }

        const data = await this.menusRepository.createMenu({
            restaurantId: restaurant.id,
            name,
            price,
        });

        return data;
    };

    getManyMenus = async ({ restaurantId, sort }) => {
        const data = await this.menusRepository.getManyMenus({ restaurantId, sort });
        return data;
    };

    getMenu = async ({ id, restaurantId }) => {
        const data = await this.menusRepository.getMenu({ id, restaurantId });

        if (!data) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }

        return data;
    };

    updateMenu = async ({ menuId, name, price, ownerId }) => {
        const restaurant = await this.restaurantRepository.findStore({ ownerId });
        if (!restaurant) {
            throw new HttpError.NotFound(MESSAGES.RESTAURANTS.NOT_ALLOW);
        }
        const existedMenu = await this.menusRepository.getMenu({ menuId, restaurantId: restaurant.id });

        if (!existedMenu) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }
        const data = await this.menusRepository.updateMenu({
            menuId,
            name,
            price,
        });

        return data;
    };

    deleteMenu = async ({ menuId, ownerId }) => {
        const restaurant = await this.restaurantRepository.findStore({ ownerId });
        if (!restaurant) {
            throw new HttpError.NotFound(MESSAGES.RESTAURANTS.NOT_ALLOW);
        }
        const existedMenu = await this.menusRepository.getMenu({ menuId, restaurantId: restaurant.id });

        if (!existedMenu) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }

        const data = await this.menusRepository.deleteMenu({ menuId });

        return data;
    };
}
