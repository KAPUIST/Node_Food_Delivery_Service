import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { ENV_CONS } from '../constants/env.constant.js';
import { AUTH_CONS } from '../constants/auth.constant.js';
import { EmailVerificationUtil } from '../utils/email-verification.util.js';
import { generateToken } from '../utils/generate-token.util.js';

export class AuthService {
    constructor(usersRepository, pointsRepository, refreshTokenRepository) {
        this.usersRepository = usersRepository;
        this.pointsRepository = pointsRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    // 회원가입 - role이 CUSTOMER이면 100만 포인트 지급, OWNER면 작성한 point 만큼 지급
    signUpUser = async ({ email, password, role, city, address, name, phoneNumber, point, verificationCode }) => {
        // 이메일 인증 제외하고 가입하고 싶으시면 19~25 주석처리 하시면 됩니다.
        const latestVerification = EmailVerificationUtil.codes[email];
        if (!latestVerification || latestVerification.code !== +verificationCode) {
            throw new HttpError.Unauthorized(MESSAGES.AUTH.SIGN_UP.VERIFICATION_CODE.INCONSISTENT);
        }
        if (EmailVerificationUtil.isCodeExpired(latestVerification.timestamp)) {
            throw new HttpError.Unauthorized(MESSAGES.AUTH.SIGN_UP.VERIFICATION_CODE.EXPIRED);
        }
        const existUserByEmail = await this.usersRepository.findUser({ email });
        const existUserByName = await this.usersRepository.findUser({ name });

        if (existUserByEmail) {
            throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED_EMAIL);
        }
        if (existUserByName) {
            throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED_NAME);
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
        point = role === AUTH_CONS.ROLE.CUSTOMER ? 1000000 : +point;
        await this.pointsRepository.addPoints({
            userId: createdUser.id,
            point,
        });
        delete createdUser.password;
        return createdUser;
    };
    // 이메일 인증
    verifyEmail = async (email) => {
        const smtpTransport = nodemailer.createTransport({
            pool: true,
            maxConnections: ENV_CONS.MAIL_MAX_CONNECTION,
            service: ENV_CONS.MAIL_SERVICE,
            host: ENV_CONS.MAIL_HOST,
            port: ENV_CONS.MAIL_PORT,
            secure: false,
            requireTLS: true,
            auth: {
                user: ENV_CONS.MAIL_AUTH_USER,
                pass: ENV_CONS.MAIL_AUTH_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const verificationCode = EmailVerificationUtil.codeIssue();

        const timestamp = Date.now();

        EmailVerificationUtil.codes[email] = { code: verificationCode, timestamp };

        const mailOptions = {
            from: AUTH_CONS.AUTH_EMAIL.FROM,
            to: email,
            subject: AUTH_CONS.AUTH_EMAIL.SUBJECT,
            html: `
          <h1>${AUTH_CONS.AUTH_EMAIL.HTML}</h1>
          <p>${verificationCode}</p>
          `,
        };
        smtpTransport.sendMail(mailOptions);
        return verificationCode;
    };

    // 로그인
    signInUser = async (email, password) => {
        const condition = { email };
        const user = await this.usersRepository.findUser(condition);
        const isValidUser = user && (await bcrypt.compare(password, user.password));
        //이메일로 조회되지 않거나 비밀번호가 일치하지 앟는 경우
        if (!isValidUser) {
            throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
        }
        const payload = { id: user.id };
        const tokens = await generateToken(this.refreshTokenRepository, payload);
        return tokens;
    };
    // 로그 아웃
    signOut = async (userId) => {
        const deletedUser = await this.refreshTokenRepository.deleteRefreshToken(userId);
        return deletedUser;
    };
    // 토큰 재발급
    reNewToken = async (user) => {
        const payload = { id: user.id };
        const tokens = await generateToken(this.refreshTokenRepository, payload);
        return tokens;
    };
}
