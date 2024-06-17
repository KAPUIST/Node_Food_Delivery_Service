import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UsersRepository } from '../repositories/users.repository.js';

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

// 회원가입 API
router.post('/sign-up', authController.signUpUser);

export default router;
