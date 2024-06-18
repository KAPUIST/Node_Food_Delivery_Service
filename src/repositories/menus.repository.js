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

        return data.map(menus => ({
            id: menus.id,
            restaurantId: menus.restaurantId,
            name: menus.name,
            price: menus.price,
            createdAt: menus.createdAt,
            updatedAt: menus.updatedAt,
        }));
    };

    getMenu = async ({ menuId, restaurantId }) => {
        return await prisma.menus.findUnique({
            where: {

                    id: menuId,
                    restaurantId: restaurantId

            }
        });
    };

    getRestaurantById = async (restaurantId) => {
        return await prisma.restaurants.findUnique({
            where: { id: restaurantId }
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
