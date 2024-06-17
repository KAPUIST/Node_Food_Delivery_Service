import express from 'express';
import {prisma} from "../utils/prisma/prisma.util.js";
import { UsersController } from '../controllers/users.controller.js';
import {UsersService} from '../services/users.service.js'
import { UsersRepository } from '../repositories/users.repository.js';

const userRepository=new UsersRepository(prisma);
const usersService= new UsersService(userRepository);
const usersController=new UsersController(usersService);

const router = express.Router();


//본인 프로필 조회
router.get('/myInfo',usersController.myInfo);

//본인 프로필 수정
router.patch('/myInfoEdit');

//본인 계정 삭제
router.delete('/deleteAccount');

//본인 포인트 충전
router.patch('/chargePoint');


export default router;