import express from 'express';

import {prisma} from "../utils/prisma/prisma.util.js";
import bcrypt from "bcrypt";
import {UsersController } from '../controllers/users.controller.js';
import {UsersService} from '../services/users.service.js'

import {UsersRepository } from '../repositories/users.repository.js';
import {RestaurantsRepository} from '../repositories/restaurants.repository.js';
import {PointsRepository} from '../repositories/points.repository.js';

import {validateAccessToken} from '../middlewares/require-access-token.middleware.js';

const userRepository=new UsersRepository(prisma);
const pointsRepository=new PointsRepository(prisma);

const usersService= new UsersService(userRepository,pointsRepository);
const usersController=new UsersController(usersService);


const router = express.Router();

//본인 프로필 조회
router.get('/me', validateAccessToken(userRepository), usersController.myInfo);

//본인 프로필 수정
router.patch('/my-info', validateAccessToken(userRepository), getOrderByIdValidator, usersController.myInfoEdit);

//본인 계정 삭제
router.delete('/account', validateAccessToken(userRepository), deleteAccountValidator, usersController.deleteAccount);

//본인 포인트 충전
router.patch('/charge-point',validateAccessToken(userRepository),usersController.chargePoint);

export default router;
