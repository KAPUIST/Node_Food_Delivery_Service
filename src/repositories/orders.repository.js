export default class OrdersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

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
