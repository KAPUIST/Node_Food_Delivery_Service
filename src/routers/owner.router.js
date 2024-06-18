import express from 'express';
import {prisma} from "../utils/prisma/prisma.util.js";

//토큰 발급
import {validateAccessToken} from '../middlewares/require-access-token.middleware.js';

//레이어 가져오기
import { UsersRepository } from '../repositories/users.repository.js';
import { OwnerService } from '../services/owner.service.js';
import { OwnerController } from "../controllers/owner.controller.js";
import { RestaurantsRepository } from '../repositories/restaurants.repository.js';


const router=express.Router();

const userRepository=new UsersRepository(prisma);
const restaurantsRepository=new RestaurantsRepository(prisma);

const ownerService=new OwnerService(userRepository,restaurantsRepository);

const ownerController=new OwnerController(ownerService);

//사장 업장 생성
router.post('/store',validateAccessToken(userRepository),ownerController.generateStore);

//사장 업장 조회
router.get('/store',validateAccessToken(userRepository),ownerController.checkStore);

//사장 업장 수정
router.patch('/store',validateAccessToken(userRepository),ownerController.updateStore);

//사장 업장 삭제
router.delete('/store',validateAccessToken(userRepository),ownerController.deleteStore);





export default router;