import express from 'express';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { MenusController } from '../controllers/menus.controller.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { prisma } from '../utils/prisma/prisma.util.js';
import { AUTH_CONS } from '../constants/auth.constant.js';
import { MenusRepository } from '../repositories/menus.repository.js';
import { MenusService } from '../services/menus.service.js';
import { RestaurantsRepository } from '../repositories/restaurants.repository.js';
import { createMenuValidator } from '../middlewares/validators/\bmenus/create-menu.validator.middleware.js';
import { getManyMenuValidator } from '../middlewares/validators/\bmenus/get-many-menus.validator.middleware.js';
import { updateMenuValidator } from '../middlewares/validators/\bmenus/update-menus.validator.middleware.js';
import { deleteMenuValidator } from '../middlewares/validators/\bmenus/delete-menus.validator.middleware.js';

const router = express.Router();

const menusRepository = new MenusRepository(prisma);
const restaurantRepository = new RestaurantsRepository(prisma);
const menusService = new MenusService(menusRepository, restaurantRepository);
const menusController = new MenusController(menusService);
const usersRepository = new UsersRepository(prisma);

//메뉴 생성
router.post(
    '/',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    createMenuValidator,
    menusController.createMenu,
);

//메뉴 조회
router.get('/:restaurantId', getManyMenuValidator, menusController.getManyMenus);

//메뉴 수정
router.patch(
    '/restaurant/:menuId',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    updateMenuValidator,
    menusController.updateMenu,
);

//메뉴 삭제
router.delete(
    '/restaurant/:menuId',
    validateAccessToken(usersRepository),
    requireRoles([AUTH_CONS.ROLE.OWNER]),
    deleteMenuValidator,
    menusController.deleteMenu,
);

export default router;
