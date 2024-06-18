import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV_CONS } from '../constants/env.constant.js';
import { AUTH_CONS } from '../constants/auth.constant.js';

export const generateToken = async (refreshTokenRepository, payload) => {
    // accessToken 생성
    const accessToken = jwt.sign(payload, ENV_CONS.ACCESS_TOKEN_KEY, {
        expiresIn: AUTH_CONS.ACCESS_EXPIRE_TIME,
    });
    // refreshToken 생성
    const refreshToken = jwt.sign(payload, ENV_CONS.REFRESH_TOKEN_KEY, {
        expiresIn: AUTH_CONS.REFRESH_EXPIRE_TIME,
    });
    // 리프레쉬 토큰 해쉬한번 더하기
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, ENV_CONS.BCRYPT_ROUND);
    await refreshTokenRepository.upsertRefreshToken(payload.id, hashedRefreshToken);
    return { accessToken, refreshToken };
};
