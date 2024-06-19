export default class OrdersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findOwnerByRestaurantId = async (restaurantId) => {
        const restaurant = await this.prisma.restaurants.findUnique({
            where: { id: restaurantId },
            select: { ownerId: true },
        });

        return restaurant ? restaurant.ownerId : null;
    };
    findOrderById = async (orderId) => {
        return await this.prisma.orders.findUnique({
            where: { id: orderId },
            include: {
                orderItems: true,
            },
        });
    };
    isOrderExists = async (customerId, orderId) => {
        return await this.prisma.orders.findUnique({
            where: { id: orderId, customerId: customerId },
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
    // 주문 상태 업데이트 기능 추가
    updateOrderStatus = async (orderId, status) => {
        return await this.prisma.orders.update({
            where: { id: orderId },
            data: { status: status.toUpperCase() },
        });
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
    // 주문 상태를 트랜잭션 내에서 업데이트
    updateOrderStatusTx = async (orderId, status, tx) => {
        return await tx.orders.update({
            where: { id: orderId },
            data: { status: status.toUpperCase() },
        });
    };

    // 레스토랑의 총 수익을 증가시키는 메서드
    incrementRestaurantRevenue = async (restaurantId, amount, tx) => {
        return await tx.restaurants.update({
            where: { id: restaurantId },
            data: { totalRevenue: { increment: amount } },
        });
    };

    // 트랜잭션을 사용하여 주문 완료 처리
    completeOrderTx = async (orderId, restaurantId, amount, callback) => {
        return await this.prisma.$transaction(async (tx) => {
            // 주문 상태를 "배달 완료"로 업데이트
            const updatedOrder = await this.updateOrderStatusTx(orderId, 'DELIVERED', tx);

            // 레스토랑의 총 수익 업데이트
            await this.incrementRestaurantRevenue(restaurantId, amount, tx);

            // 사장님의 포인트 업데이트
            await callback(tx);

            return updatedOrder;
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
