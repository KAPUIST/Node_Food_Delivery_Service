import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
import OrdersRepository from '../repositories/orders.repository.js';
import { MenusRepository } from '../repositories/menus.repository.js';
import { PointsRepository } from '../repositories/points.repository.js';
import OrdersService from '../services/orders.service.js';
import OrderController from '../controllers/orders.controller.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { AUTH_CONS } from '../constants/auth.constant.js';
import { createOrderValidator } from '../middlewares/validators/orders/create-order.validator.middleware.js';
import { getAllOrdersValidator } from '../middlewares/validators/orders/get-all-orders.validator.middleware.js';
import { getOrderByIdValidator } from '../middlewares/validators/orders/get-order-by-id.validator.middleware.js';
import { updateOrderStatusValidator } from '../middlewares/validators/orders/update-order-status.validator.middleware.js';
import { completeOrderValidator } from '../middlewares/validators/orders/complete-order.validator.middleware.js';

const usersRepository = new UsersRepository(prisma);
const orderRepository = new OrdersRepository(prisma);

const menusRepository = new MenusRepository(prisma);
const pointsRepository = new PointsRepository(prisma);
const orderService = new OrdersService(orderRepository, menusRepository, pointsRepository);
const orderController = new OrderController(orderService);
const router = express.Router();

router.post(
    '/',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.CUSTOMER]),
    createOrderValidator,
    orderController.createOrder,
);
router.get(
    '/',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    getAllOrdersValidator,
    orderController.getAllOrders,
);
router.get(
    '/:orderId',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    getOrderByIdValidator,
    orderController.getOrderById,
);
//일반적인 상태업데이트 전용입니다. 준비중, 배달중.
router.patch(
    '/:orderId/status',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    updateOrderStatusValidator,
    orderController.updateOrderStatus,
);
//배달 완료 확정 api입니다.
router.patch(
    '/:orderId/complete',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    completeOrderValidator,
    orderController.completeOrder,
);

export default router;
