import express from 'express';
import usersRouter from './users.router.js';
import authRouter from './auth.router.js';
import searchRouter from './search.router.js';


import ownerRouter from './owner.router.js';
import menusRouter from './menus.router.js';
import ordersRouter from './orders.router.js';
import ownerRouter from './owner.router.js';
import menusRouter from './menus.router.js';import rankRouter from './rank.router.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/restaurants/:restaurantId/menus', menusRouter);
router.use('/search', searchRouter);

router.use('/owner', ownerRouter);
router.use('/orders', ordersRouter);
router.use('/top-rated', rankRouter);


export default router;
