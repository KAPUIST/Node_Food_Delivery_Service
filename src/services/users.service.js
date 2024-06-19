import bcrypt from "bcrypt";

export class UsersService {
    constructor (UsersRepository,PointsRepository) {
        this.UsersRepository=UsersRepository;
        this.PointsRepository=PointsRepository;
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

        if (!changeData) {
            const error={status:403,errorMessage:"변경할 정보가 없습니다!"};
            return error;
        }

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

        delete changeData.password;

        //모든 검증이 끝난뒤 데이터 변경
        const changedUser=await this.UsersRepository.modifyUser(condition,changeData);

        return changedUser;
    }

    //계정 삭제
    deleteUser=async (condition,password) => {
        //사용자 입력 확인
        if (!password) {
            const error={status:403,errorMessage:"비밀번호를 입력해주세요!"};
            return error;
        }
        const user=await this.findUser(condition)
        if (!user) {
            const error={status:404,errorMessage:"존재하지 않는 계정입니다!"};
            return error;
        }
        if (!(await this.verifyPassword(password,user.password))) {
            const error={status:403,errorMessage:"비밀번호가 일치하지 않습니다."};
            return error;
        }

        //모든 검증이 끝난뒤 데이터 삭제
        const deletedUser=await this.UsersRepository.deleteUser(condition);
        return deletedUser;
    }
    //금액 충전
    chargePoint=async(condition,chargeMoney)=> {
        
        const chargedMoney=
        await this.PointsRepository.increasePoint(condition,chargeMoney);
        
        delete chargedMoney.id;
        delete chargedMoney.userId;

        return chargedMoney;
    }

}