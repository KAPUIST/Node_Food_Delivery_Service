export class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // 유저 정보 조회
    findUser = async (condition) => {
        const user = await this.prisma.users.findUnique({
            where: condition,
        });

        return user;
    };
    // 유저 생성
    createUser = async (condition) => {
        const createdUser = await this.prisma.users.create({
            data: condition,
        });
        return createdUser;
    };


    //유저 테이블 정보 변경
    modifyUser=async(condition,changeData) => {
        const user= await this.prisma.users.update({
            where: condition,
            data: changeData
        })
    };
}
