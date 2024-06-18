import express from 'express';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { MenusController } from '../controllers/menus.controller.js';

const router = express.Router();

const menusController = new MenusController();

//메뉴 생성
router.post('/', validateAccessToken, requireRoles, menusController.createMenu);

//메뉴 조회
router.get('/', menusController.getManyMenus);

//메뉴 수정
router.patch('/:menuId', validateAccessToken, requireRoles, menusController.updateMenu);

//메뉴 삭제
router.delete('/:menuId', validateAccessToken, requireRoles, menusController.deleteMenu);


export default router;