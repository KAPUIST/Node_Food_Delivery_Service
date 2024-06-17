import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { PointsRepository } from '../repositories/points.repository.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { validateRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';

const router = express.Router();

const refreshTokenRepository = new RefreshTokenRepository(prisma);
const pointsRepository = new PointsRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository, pointsRepository, refreshTokenRepository);
const authController = new AuthController(authService);

// 회원가입 API
router.post('/sign-up', authController.signUpUser);
// 로그인 API
router.post('/sign-in', authController.signInUser);
// 로그 아웃 API
router.post('/sign-out', validateRefreshToken(usersRepository, refreshTokenRepository), authController.signOutUser);
// 토큰 재발급 API
router.post('/refresh', validateRefreshToken(usersRepository, refreshTokenRepository), authController.reNewToken);
// 인증 미들웨어 테스트 API
router.get('/test', validateAccessToken(usersRepository), requireRoles(['CUSTOMER']), authController.test);

export default router;
