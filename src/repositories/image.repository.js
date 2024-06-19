export default class ImageRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    createImageForReview = async (reviewId, url) => {
        return await this.prisma.images.create({
            data: {
                reviewId,
                url,
            },
        });
    };
}
