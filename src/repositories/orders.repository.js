export default class OrdersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findOrderById = async (orderId) => {
        return await this.prisma.orders.findUnique({
            where: { id: orderId },
            include: {
                orderItems: true,
            },
        });
    };
    findOrdersByStatus = async (status, restaurantId) => {
        return await this.prisma.orders.findMany({
            where: { status, restaurantId },
            include: {
                orderItems: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    };
    isUserOwnerOfRestaurant = async (userId, restaurantId) => {
        const restaurant = await this.prisma.restaurants.findUnique({
            where: { id: restaurantId, ownerId: userId },
        });
        return restaurant;
    };
    // 최신순으로 최대 10개의 주문 조회
    findRecentOrders = async (restaurantId) => {
        return await this.prisma.orders.findMany({
            where: { restaurantId },
            take: 30,
            include: {
                orderItems: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    };
    createOrderTx = async (customerId, restaurantId, orderItemsWithPrice, totalPrice, callback) => {
        //트랜잭션을 활용하여 주문을 생성합니다.
        return await this.prisma.$transaction(async (tx) => {
            //콜백을 통해 트랜잭션 내에서 포인트 차감등의 작업 수행
            await callback(customerId, totalPrice, tx);
            //주문생성
            return await tx.orders.create({
                data: {
                    customerId,
                    restaurantId,
                    orderItems: {
                        create: orderItemsWithPrice.map((item) => ({
                            menuId: item.menuId,
                            quantity: item.quantity,
                            price: +item.price,
                        })),
                    },
                },
                include: {
                    orderItems: true,
                },
            });
        });
    };
}
