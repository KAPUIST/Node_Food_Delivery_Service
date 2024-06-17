import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { ENV_CONS } from '../constants/env.constant.js';
import { AUTH_CONS } from '../constants/auth.constant.js';

export class AuthService {
    constructor(usersRepository, pointsRepository, refreshTokenRepository) {
        this.usersRepository = usersRepository;
        this.pointsRepository = pointsRepository;
        this.refreshTokenRepository = refreshTokenRepository;
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
    // 로그인 - service
    signInUser = async (email, password) => {
        const condition = { email };
        const user = await this.usersRepository.findUser(condition);
        const isValidUser = user && (await bcrypt.compare(password, user.password));
        //이메일로 조회되지 않거나 비밀번호가 일치하지 앟는 경우
        if (!isValidUser) {
            throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
        }
        // accessToken 생성
        const accessToken = jwt.sign({ id: user.id }, ENV_CONS.ACCESS_TOKEN_KEY, {
            expiresIn: AUTH_CONS.ACCESS_EXPIRE_TIME,
        });
        // refreshToken 생성
        const refreshToken = jwt.sign({ id: user.id }, ENV_CONS.REFRESH_TOKEN_KEY, {
            expiresIn: AUTH_CONS.REFRESH_EXPIRE_TIME,
        });

        // 리프레쉬 토큰 해쉬한번 더하기
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, ENV_CONS.BCRYPT_ROUND);
        await this.refreshTokenRepository.upsertRefreshToken(user.id, hashedRefreshToken);
        console.log(accessToken, refreshToken);
        return { accessToken, refreshToken };
    };
}
