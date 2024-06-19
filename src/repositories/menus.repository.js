export class MenusRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    createMenu = async ({ restaurantId, name, price }) => {
        const data = await this.prisma.menus.create({
            data: {
                restaurantId,
                name,
                price,
            },
        });

        return data;
    };

    getManyMenus = async ({ restaurantId, sort }) => {
        const data = await this.prisma.menus.findMany({
            where: { restaurantId },
            orderBy: {
                createdAt: sort,
            },
        });

        return data.map((menus) => ({
            id: menus.id,
            restaurantId: menus.restaurantId,
            name: menus.name,
            price: menus.price,
            createdAt: menus.createdAt,
            updatedAt: menus.updatedAt,
        }));
    };

    getMenu = async ({ menuId, restaurantId }) => {
        return await this.prisma.menus.findUnique({
            where: {
                id: menuId,
                restaurantId: restaurantId,
            },
        });
    };

    getRestaurantById = async (restaurantId) => {
        return await this.prisma.restaurants.findUnique({
            where: { id: restaurantId },
        });
    };

    updateMenu = async ({ menuId, name, price }) => {
        const data = await this.prisma.menus.update({
            where: {
                id: menuId,
            },
            data: {
                name,
                price,
            },
        });

        return data;
    };

    deleteMenu = async ({ menuId }) => {
        const data = await this.prisma.menus.delete({
            where: {
                id: +menuId,
            },
        });

        return { id: data.id };
    };
}
