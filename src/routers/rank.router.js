import express from 'express';
import { RestaurantsRepository } from '../repositories/restaurants.repository.js';
import RankController from '../controllers/rank.controller.js';
import RankService from '../services/rank.service.js';
import { prisma } from '../utils/prisma/prisma.util.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
const router = express.Router();

const restaurantsRepository = new RestaurantsRepository(prisma);
const rankService = new RankService(restaurantsRepository);
const rankController = new RankController(rankService);
const usersRepository = new UsersRepository(prisma);

router.get('/', validateAccessToken(usersRepository), rankController.getHighestRevenueRestaurants);

export default router;
