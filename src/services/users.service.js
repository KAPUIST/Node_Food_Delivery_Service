export class UsersService {
    constructor (UsersRepository) {
        this.UsersRepository=UsersRepository;
    }
    findUser=async(condition)=>{
        const user=await this.UsersRepository.findUser(condition);
        return user;
    }

    verifyPassword=async(password,hashedPassword)=>{
        return await bcrypt.compare(password,hashedPassword);
    }

    myInfo=async (condition)=> {
        const user=await this.findUser(condition);

        //errorCase
        if (!user) {
            const error={status:400,errorMessage:"존재하지 않는 계정입니다."};
            return error;
        }
        return user;
    }

    myInfoEdit=async (condition,changeData)=> {
        const user= await this.findUser(condition);

        const password=changeData.password;

        //비밀번호 검증
        if (!password) {
            const error={status:403,errorMessage:"비밀번호를 입력해주세요!"};
            return error;
        }

        if (!(await this.verifyPassword(password,user.password))) {
            const error={status:403,errorMessage:"비밀번호가 일치하지 않습니다."};
            return error;
        }

        //모든 검증이 끝난뒤 데이터 변경
        const changedUser=await this.UsersRepository.modifyUser(condition,changeData);


        return changedUser;
    }

}