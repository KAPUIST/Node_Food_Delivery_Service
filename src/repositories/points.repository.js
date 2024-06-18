export class PointsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    addPoints = async (condition) => {
        await this.prisma.points.create({
            data: condition,
        });
    };
}
