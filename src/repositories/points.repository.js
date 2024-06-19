export class PointsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    addPoints = async (condition) => {
        await this.prisma.points.create({
            data: condition,
        });
    };
    findUserPoint = async (userId) => {
        return await this.prisma.points.findUnique({ where: { userId } });
    };
    incrementUserPointTx = async (userId, point, tx) => {
        return await tx.points.update({
            where: { userId },
            data: { point: { increment: point } },
        });
    };
    decrementUserPointTx = async (userId, point, tx) => {
        return await tx.points.update({
            where: { userId },
            data: { point: { decrement: point } },
        });
    };

    increasePoint=async(condition,point) => {
        console.log(2);
        return await this.prisma.points.update({
            where:condition,
            data:{
                point: { increment: point }
            }
        });
    }
}
