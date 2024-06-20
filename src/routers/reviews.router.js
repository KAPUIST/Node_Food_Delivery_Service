import express from 'express';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { prisma } from '../utils/prisma/prisma.util.js';
import OrdersRepository from '../repositories/orders.repository.js';
import ReviewsRepository from '../repositories/reviews.repository.js';
import ReviewsService from '../services/reviews.service.js';
import ReviewsController from '../controllers/reviewsController.js';
import { AUTH_CONS } from '../constants/auth.constant.js';
import { UsersRepository } from '../repositories/users.repository.js';
import ImageRepository from '../repositories/image.repository.js';
import { upload } from '../utils/aws/s3-uploader.js';
import { createReviewValidator } from '../middlewares/validators/reviews/create-review.validator.middleware.js';
import { getReviewValidator } from '../middlewares/validators/reviews/get-review.validator.middleware.js';
import { updateReviewValidator } from '../middlewares/validators/reviews/update-review.validator.middleware.js';
import { deleteReviewValidator } from '../middlewares/validators/reviews/delete-review.validator.middleware.js';
const usersRepository = new UsersRepository(prisma);
const reviewsRepository = new ReviewsRepository(prisma);
const ordersRepository = new OrdersRepository(prisma);
const imageRepository = new ImageRepository(prisma);
const reviewsService = new ReviewsService(reviewsRepository, ordersRepository, imageRepository);
const reviewsController = new ReviewsController(reviewsService);
const router = express.Router();

router.get('/:restaurantId/restaurant', getReviewValidator, reviewsController.getReviewsByRestaurant);
router.post(
    '/:orderId/order',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.CUSTOMER]),
    // createReviewValidator,
    upload.single('images'),
    (req, res, next) => {
        reviewsController.createReview(req, res, next);
    },
);
router.put(
    '/:reviewId',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.CUSTOMER]),
    updateReviewValidator,
    reviewsController.updateReview,
);
router.delete(
    '/:reviewId',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.CUSTOMER]),
    deleteReviewValidator,
    reviewsController.deleteReview,
);
export default router;
