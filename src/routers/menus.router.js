import express from 'express';
import { MenusController } from '../controllers/menus.controller.js';

const router = express.Router();

const menusController = new MenusController();

//메뉴 생성
router.post('/', menusController.createMenu);

//메뉴 조회
router.get('/', menusController.getManyMenus);

//메뉴 수정
router.patch('/:menuId', menusController.updateMenu);

//메뉴 삭제
router.delete('/:menuId', menusController.deleteMenu);


export default router;