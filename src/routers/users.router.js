import express from 'express';
import {prisma} from "../utils/prisma/prisma.util.js";
import { Userscontroller } from '../controllers/users.controller.js';
import {UsersService} from '../services/users.service.js'
import { UsersRepository } from '../repositories/users.repository.js';

const userRepository=new UsersRepository(prisma);
const usersService= new UsersService(userRepository);
const userscontroller=new Userscontroller(usersService);

const router = express.Router();

console.log("<===Applyed users.Router===>")

//본인 프로필 조회
router.get('/myinfo',userscontroller.myinfo);

//본인 프로필 수정
router.patch('/myinfoedit');

//본인 계정 삭제
router.delete('/deleteaccount');

//본인 포인트 충전
router.patch('/chargepoint');


export default router;