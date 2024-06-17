export default class MenusRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMenu = async (menuId) => {
        return await this.prisma.menus.findUnique({ where: { id: menuId } });
    };
}
