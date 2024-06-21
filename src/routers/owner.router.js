import express from 'express';
import { prisma } from '../utils/prisma/prisma.util.js';
//토큰 발급
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
//레이어 가져오기
import { UsersRepository } from '../repositories/users.repository.js';
import { OwnerService } from '../services/owner.service.js';
import { OwnerController } from '../controllers/owner.controller.js';
import { RestaurantsRepository } from '../repositories/restaurants.repository.js';
import { generateStoreValidator } from '../middlewares/validators/owner/generate-store.validator.middleware.js';
import { updateStoreValidator } from '../middlewares/validators/owner/update-store.validator.middleware.js';
import { restoreStoreValidator } from '../middlewares/validators/owner/restore-store.validator.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { AUTH_CONS } from '../constants/auth.constant.js';
const router = express.Router();

const userRepository = new UsersRepository(prisma);
const restaurantsRepository = new RestaurantsRepository(prisma);

const ownerService = new OwnerService(userRepository, restaurantsRepository);

const ownerController = new OwnerController(ownerService);

//사장 업장 생성
router.post(
    '/store',
    validateAccessToken(userRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    generateStoreValidator,
    ownerController.generateStore,
);

//사장 업장 조회
router.get(
    '/store',
    validateAccessToken(userRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    ownerController.checkStore,
);

//사장 업장 수정
router.patch(
    '/store',
    validateAccessToken(userRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    updateStoreValidator,
    ownerController.updateStore,
);

//사장 업장 삭제
router.delete(
    '/store',
    validateAccessToken(userRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    ownerController.deleteStore,
);

//사장 업장 복원
router.patch(
    '/restore',
    validateAccessToken(userRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    restoreStoreValidator,
    ownerController.restoreStore,
);

export default router;
