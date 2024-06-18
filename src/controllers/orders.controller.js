import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { CompleteOrderStatus, OrderStatus, CommonOrderStatus } from '../constants/orders.constant.js';
export default class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    createOrder = async (req, res, next) => {
        try {
            const { orderItems, restaurantId } = req.body;
            //임시 사용 유저
            const userId = req.user.id;
            //joi를 통해서 유효성 검사 추가 예정입니다.
            const order = await this.orderService.placeOrder(userId, restaurantId, orderItems);

            res.status(HTTP_STATUS.CREATED).json({
                result: order,
            });
        } catch (error) {
            next(error);
        }
    };
    getOrderById = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;
            const order = await this.orderService.getOrderById(+orderId);
            if (!order) {
                throw new HttpError.NotFound(` 주문 번호 : ${orderId}, ${MESSAGES.ORDER.COMMON.ORDER_NOT_FOUND}`);
            }
            const isOwner = await this.orderService.verifyRestaurantOwner(userId, order.restaurantId);
            if (!isOwner) {
                throw new HttpError.Forbidden(MESSAGES.RESTAURANTS.NOT_ALLOW);
            }
            res.status(HTTP_STATUS.OK).json({
                result: order,
            });
        } catch (error) {
            next(error);
        }
    };
    getAllOrders = async (req, res, next) => {
        try {
            const userId = req.user.id;
            let { status, restaurantId } = req.query;
            if (!restaurantId) {
                throw new HttpError.BadRequest(MESSAGES.ORDER.COMMON.RESTAURANT_ID_IS_REQUIRED);
            }
            const isOwner = await this.orderService.verifyRestaurantOwner(userId, +restaurantId);
            if (!isOwner) {
                throw new HttpError.Forbidden(MESSAGES.RESTAURANTS.NOT_ALLOW);
            }
            if (status && !Object.values(OrderStatus).includes(status.toUpperCase())) {
                status = undefined;
            }
            const orders = await this.orderService.getAllOrders(status, +restaurantId);
            res.status(HTTP_STATUS.OK).json({
                result: orders,
            });
        } catch (error) {
            next(error);
        }
    };
    updateOrderStatus = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { status } = req.body; // 새로운 상태 값
            const userId = req.user.id;

            if (!Object.values(CommonOrderStatus).includes(status.toUpperCase())) {
                throw new HttpError.BadRequest(MESSAGES.ORDER.COMMON.UNKNOWN_STATUS);
            }
            const order = await this.orderService.getOrderById(+orderId);
            if (!order) {
                throw new HttpError.NotFound(`주문 번호 : ${orderId}, ${MESSAGES.ORDER.COMMON.ORDER_NOT_FOUND}`);
            }
            if (order.status === CompleteOrderStatus.DELIVERED) {
                throw new HttpError.BadRequest(`주문 번호 : ${orderId}, ${MESSAGES.ORDER.COMMON.ALREADY_COMPLETED}`);
            }
            const isOwner = await this.orderService.verifyRestaurantOwner(userId, order.restaurantId);
            if (!isOwner) {
                throw new HttpError.Forbidden(MESSAGES.RESTAURANTS.NOT_ALLOW);
            }
            const updatedOrder = await this.orderService.updateOrderStatus(+orderId, status);

            res.status(HTTP_STATUS.OK).json({
                result: updatedOrder,
            });
        } catch (error) {
            next(error);
        }
    };
    completeOrder = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;

            const order = await this.orderService.getOrderById(+orderId);
            if (!order) {
                throw new HttpError.NotFound(`주문 번호 : ${orderId}, ${MESSAGES.ORDER.COMMON.ORDER_NOT_FOUND}`);
            }
            if (order.status === CompleteOrderStatus.DELIVERED) {
                throw new HttpError.BadRequest(`주문 번호 : ${orderId}, ${MESSAGES.ORDER.COMMON.ALREADY_COMPLETED}`);
            }
            const isOwner = await this.orderService.verifyRestaurantOwner(userId, order.restaurantId);
            if (!isOwner) {
                throw new HttpError.Forbidden(MESSAGES.RESTAURANTS.NOT_ALLOW);
            }

            // 주문 상태를 "배달 완료"로 업데이트
            const updatedOrder = await this.orderService.completeOrder(userId, +orderId, order);

            res.status(HTTP_STATUS.OK).json({
                result: updatedOrder,
            });
        } catch (error) {
            next(error);
        }
    };
}
