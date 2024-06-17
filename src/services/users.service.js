export class UsersService {
    constructor (UsersRepository) {
        this.UsersRepository=UsersRepository;
    }

    myInfo=async (userId)=> {

        const user=await this.UsersRepository.findUser(userId);

        //errorCase
        if (!user) {
            const error={status:400,errorMessage:"존재하지 않는 계정입니다."};
            return error;
        } 


        
        return user;
    }

}