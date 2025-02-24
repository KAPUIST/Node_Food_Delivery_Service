import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { notifyChangedOrderStatus, notifyNewOrder } from '../utils/websocket/websocket.js';
export default class OrdersService {
    constructor(orderRepository, menusRepository, pointsRepository) {
        this.orderRepository = orderRepository;
        this.menusRepository = menusRepository;
        this.pointsRepository = pointsRepository;
    }

    getOrderById = async (orderId) => {
        const order = await this.orderRepository.findOrderById(orderId);
        return order;
    };

    // isOrderExists = async (customerId, orderId) => {
    //     const order = await this.orderRepository.isOrderExists(customerId, orderId);
    //     return order;
    // };

    getAllOrders = async (status, restaurantId) => {
        if (status) {
            return await this.orderRepository.findOrdersByStatus(status, restaurantId);
        } else {
            return await this.orderRepository.findRecentOrders(restaurantId);
        }
    };
    // 주문 상태 업데이트 기능 추가
    updateOrderStatus = async (orderId, status) => {
        const newOrderStatus = await this.orderRepository.updateOrderStatus(orderId, status);

        if (newOrderStatus) {
            // "고객님"에게 상태 변경 알림 보내기
            notifyChangedOrderStatus(newOrderStatus.customerId, newOrderStatus.status);
        }
        return newOrderStatus;
    };
    //본인 레스토랑인지 확인하는 함수
    verifyRestaurantOwner = async (userId, restaurantId) => {
        return await this.orderRepository.isUserOwnerOfRestaurant(userId, restaurantId);
    };
    // 배달 완료 기능
    completeOrder = async (userId, orderId, order) => {
        // 주문 항목의 총 가격 계산
        const totalAmount = order.orderItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const completedOrder = await this.orderRepository.completeOrderTx(
            orderId,
            order.restaurantId,
            totalAmount,
            async (tx) => {
                // 사장님의 포인트 업데이트
                await this.pointsRepository.incrementUserPointTx(userId, totalAmount, tx);
            },
        );

        notifyChangedOrderStatus(completedOrder.customerId, completedOrder.status);
        return completedOrder;
    };

    //모든 메뉴가 존재하는지 확인하고, 각 메뉴가 같은 음식점에 속해 있는지 확인합니다.
    #validateAndCalculateTotalPrice = async (orderItems, restaurantId) => {
        let totalPrice = 0;

        for (const item of orderItems) {
            const menu = await this.menusRepository.getMenu({ menuId: item.menuId, restaurantId });
            if (!menu) {
                throw new HttpError.BadRequest(MESSAGES.MENU.COMMON.NOT_FOUND);
            }
            console.log(item, restaurantId);

            // 메뉴가 요청된 restaurantId에 속해 있는지 확인
            if (menu.restaurantId !== restaurantId) {
                throw new HttpError.BadRequest(`${menu.name},${MESSAGES.MENU.COMMON.MENU_NOT_FOUND_IN_RESTAURANT}`);
            }
            // 각 orderItem에 price 계산
            item.price = menu.price;
            // 총 가격 계산
            totalPrice += menu.price * item.quantity;
        }
        console.log();
        return { totalPrice, orderItemsWithPrice: orderItems };
    };
    #checkUserPoint = async (userId, totalPrice) => {
        const user = await this.pointsRepository.findUserPoint(userId);
        if (!user || user.point < totalPrice) {
            throw new HttpError.BadRequest(`${MESSAGES.POINTS.COMMON.NOT_ENOUGH_POINT}`);
        }
    };
    placeOrder = async (userId, restaurantId, orderItems) => {
        const { totalPrice, orderItemsWithPrice } = await this.#validateAndCalculateTotalPrice(
            orderItems,
            restaurantId,
        );

        await this.#checkUserPoint(userId, totalPrice);

        const newOrder = await this.orderRepository.createOrderTx(
            userId,
            restaurantId,
            orderItemsWithPrice,
            totalPrice,
            async (userId, totalPrice, tx) => {
                await this.pointsRepository.decrementUserPointTx(userId, totalPrice, tx);
            },
        );
        // 레스토랑 ID를 기반으로 사장님 ID 조회
        const ownerId = await this.orderRepository.findOwnerByRestaurantId(restaurantId);

        // 새 주문이 생성된 후 "사장님"에게 알림 전송
        if (ownerId) {
            notifyNewOrder(ownerId); // 사장님에게 알림 전송
        }
        return newOrder;
    };
}
