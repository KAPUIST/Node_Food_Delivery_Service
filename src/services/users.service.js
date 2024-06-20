import bcrypt from 'bcrypt';
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UsersService {
    constructor(UsersRepository, PointsRepository) {
        this.UsersRepository = UsersRepository;
        this.PointsRepository = PointsRepository;
    }
    findUser = async (condition) => {
        const user = await this.UsersRepository.findUser(condition);
        return user;
    };

    verifyPassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    };

    myInfo = async (condition) => {
        const user = await this.findUser(condition);

        //errorCase
        if (!user) {
            throw new HttpError.BadRequest(MESSAGES.USER.COMMON.GET_USER.NOT_EXISTED);
        }
        //정보 삭제
        delete user.password;
        delete user.id;
        delete user.role;
        delete user.phoneNumber;
        delete user.updatedAt;

        return user;
    };

    myInfoEdit = async (condition, changeData) => {
        const user = await this.findUser(condition);

        if (!changeData) {
            throw new HttpError.BadRequest(MESSAGES.USER.COMMON.EDIT_USER.NOT_DATA);
        }
        const password = changeData.password;

        //비밀번호 검증
        if (!password) {
            throw new HttpError.Forbidden(MESSAGES.USER.COMMON.EDIT_USER.PASSWORD);
        }

        if (!(await this.verifyPassword(password, user.password))) {
            throw new HttpError.Forbidden(MESSAGES.USER.COMMON.EDIT_USER.NOT_MATCHED_PASSWORD);
        }

        delete changeData.password;

        //모든 검증이 끝난뒤 데이터 변경
        const changedUser = await this.UsersRepository.modifyUser(condition, changeData);

        return changedUser;
    };

    //계정 삭제
    deleteUser = async (condition, password) => {
        //사용자 입력 확인
        if (!password) {
            throw new HttpError.Forbidden(MESSAGES.USER.COMMON.DELETE_USER.PASSWORD);
        }
        const user = await this.findUser(condition);
        if (!user) {
            throw new HttpError.NotFound(MESSAGES.USER.COMMON.DELETE_USER.NOT_EXISTED);
        }
        if (!(await this.verifyPassword(password, user.password))) {
            throw new HttpError.Forbidden(MESSAGES.USER.COMMON.DELETE_USER.NOT_MATCHED_PASSWORD);
        }
        //모든 검증이 끝난뒤 데이터 삭제
        const deletedUser = await this.UsersRepository.deleteUser(condition);
        return deletedUser;
    };
    //금액 충전
    chargePoint = async (condition, chargeMoney) => {
        const chargedMoney = await this.PointsRepository.increasePoint(condition, chargeMoney);
        delete chargedMoney.id;
        delete chargedMoney.userId;
        return chargedMoney;
    };
}
