export class RestaurantsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    findStore = async (condition) => {
        condition.flag="EXISTS";
        const restaurant = await this.prisma.Restaurants.findFirst({
            where: condition,
        });

        return restaurant;
    };

    all_FindNoneExistStore= async (condition) => {
        condition.flag="NOT_EXISTS";
        const restaurant = await this.prisma.Restaurants.findMany({
            where: condition,
        });

        return restaurant;
    };

    restoreStore=async(condition)=> {
        const restoreStore=await this.prisma.Restaurants.update({
            where: condition,data:{
                flag:"EXISTS"
            }
        });
        return restoreStore;
    }



    makeStore = async (storeData) => {
        const restaurant = await this.prisma.Restaurants.create({
            data: storeData,
        });
        return restaurant;
    };

    modifyStore = async (condition, changeData) => {
        //먼저 본인의 상점을 탐색

        const changedRestaurant = await this.prisma.Restaurants.update({
            where: condition,
            data: changeData,
        });

        return changedRestaurant;
    };

    deleteStore = async (condition) => {
        const deletedStore = await this.prisma.Restaurants.update({
            where: condition,data:{flag:"NOT_EXISTS"}
        });
        return deletedStore;
    };

    findHeighRevenueRestaurant = async () => {
        return await this.prisma.restaurants.findMany({
            orderBy: {
                totalRevenue: 'desc',
            },
            take: 5,
        });
    };
}
