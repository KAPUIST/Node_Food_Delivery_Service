import { HTTP_STATUS } from '../constants/http-status.constant.js';

export default class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    createOrder = async (req, res, next) => {
        try {
            const { orderItems, restaurantId } = req.body;
            //임시 사용 유저
            const userId = 1;
            //joi를 통해서 유효성 검사 추가 예정입니다.
            const order = await this.orderService.placeOrder(userId, restaurantId, orderItems);

            res.status(HTTP_STATUS.CREATED).json({
                result: order,
            });
        } catch (error) {
            next(error);
        }
    };
}
