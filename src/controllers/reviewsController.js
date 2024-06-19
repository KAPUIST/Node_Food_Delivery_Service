import { HTTP_STATUS } from '../constants/http-status.constant.js';
export default class ReviewsController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }

    getReviewsByRestaurant = async (req, res, next) => {
        try {
            const { restaurantId } = req.params;
            let { orderBy } = req.query;
            if (orderBy && !Object.values({ desc: 'desc', asc: 'asc' }).includes(orderBy.toLowerCase())) {
                orderBy = 'desc';
            }
            const reviews = await this.reviewService.findReviewByRestaurantId(+restaurantId, orderBy);
            res.status(HTTP_STATUS.OK).json({
                results: reviews,
            });
        } catch (error) {
            next(error);
        }
    };
    createReview = async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { orderId } = req.params;
            const { rating, comment } = req.body;
            const images = req.file;
            const reviews = await this.reviewService.createReview(customerId, +orderId, +rating, comment, images);
            res.status(HTTP_STATUS.OK).json({
                results: reviews,
            });
        } catch (error) {
            next(error);
        }
    };
    updateReview = async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { reviewId } = req.params;
            const { rating, comment } = req.body;
            const reviews = await this.reviewService.updateReview(customerId, +reviewId, rating, comment);
            res.status(HTTP_STATUS.OK).json({
                results: reviews,
            });
        } catch (error) {
            next(error);
        }
    };
    deleteReview = async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { reviewId } = req.params;
            const reviews = await this.reviewService.deleteReview(customerId, +reviewId);
            res.status(HTTP_STATUS.OK).json({
                reviewId: reviews.id,
            });
        } catch (error) {
            next(error);
        }
    };
}
