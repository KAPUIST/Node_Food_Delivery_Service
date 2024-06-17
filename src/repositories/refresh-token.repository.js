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
}
