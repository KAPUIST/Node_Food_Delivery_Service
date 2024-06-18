import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
import OrdersRepository from '../repositories/orders.repository.js';
import { MenusRepository } from '../repositories/menus.repository.js';
import { PointsRepository } from '../repositories/points.repository.js';
import OrdersService from '../services/orders.service.js';
import OrderController from '../controllers/orders.controller.js';

const orderRepository = new OrdersRepository(prisma);
const menusRepository = new MenusRepository(prisma);
const pointsRepository = new PointsRepository(prisma);
const orderService = new OrdersService(orderRepository, menusRepository, pointsRepository);
const orderController = new OrderController(orderService);
const router = express.Router();

router.post('/', orderController.createOrder);

export default router;
