import { MenusRepository } from '../repositories/menus.repository.js'
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class MenusService {
    menusRepository = new MenusRepository();

    createMenu = async (restaurantId, name, price, ownerId ) => {
        const data = await this.menusRepository.createMenu({
            data:{
                restaurantId, name, price, ownerId
            }
    });

        return data;
    };

    getManyMenus = async ({ restaurantId, sort }) => {
        const data = await this.menusRepository.getManyMenus({restaurantId, sort});

        return data;
    }


    updateMenu = async ({ id, restaurantId, name, price, ownerId }) => {
        const existedMenu = await this.menusRepository.getMenu(id)

        if(!existedMenu) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }

        if (existedMenu.ownerId !== ownerId) {
            throw new HttpError.Forbidden(MESSAGES.AUTH.FORBIDDEN);
        }

        const data = await this.menusRepository.updateMenu({
            id, restaurantId, name, price, ownerId
         })

        return data;
    }

    deleteMenu = async ({ id, restaurantId, ownerId }) => {
        const existedMenu = await this.menusRepository.getMenu({
            id, restaurantId
        })

        if(!existedMenu) {
            throw new HttpError.NotFound(MESSAGES.MENU.COMMON.NOT_FOUND);
        }

        const data = await this.menusRepository.deleteMenu({id, restaurantId, ownerId });
    

        return data
    }
}