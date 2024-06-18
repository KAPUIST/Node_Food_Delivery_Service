import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

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

    getAllOrders = async (status, restaurantId) => {
        if (status) {
            return await this.orderRepository.findOrdersByStatus(status, restaurantId);
        } else {
            return await this.orderRepository.findRecentOrders(restaurantId);
        }
    };
    verifyRestaurantOwner = async (userId, restaurantId) => {
        return await this.orderRepository.isUserOwnerOfRestaurant(userId, restaurantId);
    };

    //모든 메뉴가 존재하는지 확인하고, 각 메뉴가 같은 음식점에 속해 있는지 확인합니다.
    #validateAndCalculateTotalPrice = async (orderItems, restaurantId) => {
        let totalPrice = 0;

        for (const item of orderItems) {
            const menu = await this.menusRepository.getMenu(item.menuId);
            if (!menu) {
                throw new HttpError.BadRequest(MESSAGES.MENU.COMMON.NOT_FOUND);
            }

            // 메뉴가 요청된 restaurantId에 속해 있는지 확인
            if (menu.restaurantId !== restaurantId) {
                throw new HttpError.BadRequest(`${menu.name},${MESSAGES.MENU.COMMON.MENU_NOT_FOUND_IN_RESTAURANT}`);
            }
            // 각 orderItem에 price 계산
            const itemTotalPrice = menu.price * item.quantity;
            item.price = itemTotalPrice;
            // 총 가격 계산
            totalPrice += menu.price * item.quantity;
        }

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
        return await this.orderRepository.createOrderTx(
            userId,
            restaurantId,
            orderItemsWithPrice,
            totalPrice,
            async (userId, totalPrice, tx) => {
                await this.pointsRepository.decrementUserPointTx(userId, totalPrice, tx);
            },
        );
    };
}
