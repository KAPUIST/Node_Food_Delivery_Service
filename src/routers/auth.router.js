import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { PointsRepository } from '../repositories/points.repository.js';

const router = express.Router();

const pointsRepository = new PointsRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository, pointsRepository);
const authController = new AuthController(authService);

// 회원가입 API
router.post('/sign-up', authController.signUpUser);

export default router;
