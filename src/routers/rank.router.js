import express from 'express';
import { RestaurantsRepository } from '../repositories/restaurants.repository.js';
import RankController from '../controllers/rank.controller.js';
import RankService from '../services/rank.service.js';
import { prisma } from '../utils/prisma/prisma.util.js';
const router = express.Router();

const restaurantsRepository = new RestaurantsRepository(prisma);
const rankService = new RankService(restaurantsRepository);
const rankController = new RankController(rankService);

router.get('/', rankController.getHighestRevenueRestaurants);

export default router;
