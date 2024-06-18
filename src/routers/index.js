import express from 'express';
import usersRouter from './users.router.js';
import authRouter from './auth.router.js';
import searchRouter from './search.router.js';

import menusRouter from './menus.router.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/restaurants/:restaurantId/menus', menusRouter);
router.use('/search', searchRouter);


export default router;
