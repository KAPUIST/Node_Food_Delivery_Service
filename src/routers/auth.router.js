import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { PointsRepository } from '../repositories/points.repository.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';

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

export default router;
