export class RefreshTokenRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // refreshToken 생성, 업데이트
    upsertRefreshToken = async (userId, hashedRefreshToken) => {
        await this.prisma.tokens.upsert({
            where: { userId },
            update: { token: hashedRefreshToken },
            create: { userId, token: hashedRefreshToken },
        });
    };

    // refreshToken 조회
    findRefreshToken = async (userId) => {
        const exitedRefreshToken = await this.prisma.tokens.findUnique({
            where: { userId },
        });
        return exitedRefreshToken;
    };
    // refreshToken 삭제
    deleteRefreshToken = async (userId) => {
        const deletedUser = await this.prisma.tokens.update({
            where: { userId },
            data: {
                token: null,
            },
        });
        return deletedUser;
    };
}
