import bcrypt from 'bcrypt';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { ENV_CONS } from '../constants/env.constant.js';

export class AuthService {
    constructor(usersRepository, pointsRepository) {
        this.usersRepository = usersRepository;
        this.pointsRepository = pointsRepository;
    }
    // 회원가입 - service
    signUpUser = async ({ email, password, role, city, address, name, phoneNumber }) => {
        const existUser = await this.usersRepository.findUser({ email });

        if (existUser) {
            throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
        }

        const hashedPassword = await bcrypt.hash(password, ENV_CONS.BCRYPT_ROUND);
        const createdUser = await this.usersRepository.createUser({
            email,
            password: hashedPassword,
            role,
            city,
            address,
            name,
            phoneNumber,
        });
        delete createdUser.password;
        return createdUser;
    };
}
