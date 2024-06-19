export default class ReviewsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 메뉴에 리뷰를 달수 있도록 기능을 추가한다면
    // findReviewByMenuId = async (menuId, orderBy) => {
    //     return await this.prisma.reviews.findMany({
    //         where: { menuId },
    //         orderBy: {
    //             createdAt: sort,
    //         },
    //     });
    // };
    isOrderReviewed = async (customerId, orderId) => {
        return await this.prisma.reviews.findFirst({ where: { customerId, orderId } });
    };
    findReview = async (customerId, reviewId) => {
        return await this.prisma.reviews.findFirst({ where: { customerId, id: reviewId } });
    };
    findReviewByRestaurantId = async (restaurantId, orderBy) => {
        return await this.prisma.reviews.findMany({
            where: { restaurantId },
            orderBy: {
                createdAt: orderBy,
            },
        });
    };
    createReview = async (customerId, orderId, restaurantId, rating, comment) => {
        const data = await this.prisma.reviews.create({
            data: {
                customerId,
                orderId,
                restaurantId,
                rating,
                comment,
            },
        });

        return data;
    };
    updateReview = async (reviewId, rating, comment) => {
        const data = await this.prisma.reviews.update({
            where: { id: reviewId },
            data: {
                rating,
                comment,
            },
        });

        return data;
    };
    deleteReview = async (reviewId) => {
        return await this.prisma.reviews.delete({
            where: {
                id: reviewId,
            },
        });
    };
}
