import { prisma } from '../utils/prisma/prisma.util.js';

export class MenusRepository {
    createMenu = async ({ restaurantId, name, price }) => {
        const data = await prisma.menus.create({
            data: {
                restaurantId, name, price
            }
        });

        return data;
    };

    getManyMenus = async ({ restaurantId, sort }) => {
        const data = await prisma.menus.findMany({
            where: { restaurantId },
            orderBy: {
                createdAt: sort,
            },
        });

        return data.map(menu => ({
            id: menu.id,
            restaurantId: menu.restaurantId,
            name: menu.name,
            price: menu.price,
            createdAt: menu.createdAt,
            updatedAt: menu.updatedAt,
        }));
    };

    getMenu = async ({ menuId, restaurantId }) => {
        return await prisma.menus.findUnique({
            where: {
                id_restaurantId: {
                    id: menuId,
                    restaurantId: restaurantId
                }
            }
        });
    };

    updateMenu = async ({ id, restaurantId, name, price }) => {
        const data = await prisma.menus.update({
            where: {
                    id: +id,
                    restaurantId: restaurantId,
            },
            data: {
                name,
                price
            }
        });

        return data;
    };

    deleteMenu = async ({ id, restaurantId }) => {
        const data = await prisma.menus.delete({
            where: {
                    id: +id,
                    restaurantId: restaurantId,
            }
        });

        return { id: data.id };
    };
}
