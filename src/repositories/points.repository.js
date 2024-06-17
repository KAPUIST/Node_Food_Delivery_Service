export class PointsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    addPoints = async (condition) => {
        console.log('1111');
        await this.prisma.points.create({
            data: { condition },
        });
    };
}
