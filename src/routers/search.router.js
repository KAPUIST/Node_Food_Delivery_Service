import express from 'express';
import SearchRepository from '../repositories/search.repository.js';
import SearchController from '../controllers/search.controller.js';
import SearchService from '../services/search.service.js';
import { prisma } from '../utils/prisma/prisma.util.js';
import { searchRestaurantsValidator } from '../middlewares/validators/search/search-restaurants.validator.middleware.js';
const router = express.Router();

const searchRepository = new SearchRepository(prisma);
const searchService = new SearchService(searchRepository);
const searchController = new SearchController(searchService);

router.get('/restaurants', searchRestaurantsValidator, searchController.searchRestaurants);

export default router;
