import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
import OrdersRepository from '../repositories/orders.repository.js';
import MenusRepository from '../repositories/menus.repository.js';
import { PointsRepository } from '../repositories/points.repository.js';
import OrdersService from '../services/orders.service.js';
import OrderController from '../controllers/orders.controller.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { AUTH_CONS } from '../constants/auth.constant.js';
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
    orderController.createOrder,
);
router.get(
    '/',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    orderController.getAllOrders,
);
router.get(
    '/:orderId',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    orderController.getOrderById,
);
//일반적인 상태업데이트 전용입니다. 준비중, 배달중.
router.patch(
    '/:orderId/status',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    orderController.updateOrderStatus,
);
//배달 완료 확정 api입니다.
router.patch(
    '/:orderId/complete',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    orderController.completeOrder,
);

export default router;
