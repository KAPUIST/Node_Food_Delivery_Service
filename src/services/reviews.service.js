import { MESSAGES } from '../constants/message.constant.js';
import { COMPLETE_ORDER_STATUS } from '../constants/orders.constant.js';
import { HttpError } from '../errors/http.error.js';
import { uploadImages } from '../utils/aws/s3-uploader.js';

export default class ReviewsService {
    constructor(reviewRepository, orderRepository, imageRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.imageRepository = imageRepository;
    }
    #isOrderReviewedByOrderId = async (customerId, orderId) => {
        const isOrderReviewed = await this.reviewRepository.isOrderReviewed(customerId, orderId);
        return isOrderReviewed;
    };

    #isOrderExists = async (customerId, orderId) => {
        const isOrderExists = await this.orderRepository.isOrderExists(customerId, orderId);
        if (!isOrderExists) {
            throw new HttpError.NotFound(MESSAGES.REVIEW.COMMON.NOT_FOUND);
        }
        if (COMPLETE_ORDER_STATUS.DELIVERED !== isOrderExists.status) {
            throw new HttpError.NotFound(MESSAGES.REVIEW.COMMON.NOT_DELIVERED);
        }
        return isOrderExists;
    };
    findReviewByRestaurantId = async (restaurantId, orderBy) => {
        return await this.reviewRepository.findReviewByRestaurantId(restaurantId, orderBy);
    };
    createReview = async (customerId, orderId, rating, comment, images) => {
        //해당오더가 존재하는지 알아야함
        const order = await this.#isOrderExists(customerId, orderId);
        //해당 오더에 리뷰를 작성했는지 확인해야함
        const isOrderReviewed = await this.#isOrderReviewedByOrderId(customerId, orderId);
        if (isOrderReviewed) {
            throw new HttpError.Conflict(MESSAGES.REVIEW.CREATE.CONFLICT);
        }

        const review = await this.reviewRepository.createReview(
            customerId,
            orderId,
            order.restaurantId,
            rating,
            comment,
        );

        if (images) {
            //const imageUrls = await uploadImages(images);
            await this.imageRepository.createImageForReview(review.id, images.location);
        }
        return review;
    };
    updateReview = async (customerId, reviewId, rating, comment) => {
        const review = await this.reviewRepository.findReview(customerId, reviewId);
        if (!review) {
            throw new HttpError.NotFound(MESSAGES.REVIEW.COMMON.NOT_FOUND);
        }
        return await this.reviewRepository.updateReview(reviewId, rating, comment);
    };
    deleteReview = async (customerId, reviewId) => {
        const review = await this.reviewRepository.findReview(customerId, reviewId);
        if (!review) {
            throw new HttpError.NotFound(MESSAGES.REVIEW.COMMON.NOT_FOUND);
        }
        return await this.reviewRepository.deleteReview(reviewId);
    };
}
