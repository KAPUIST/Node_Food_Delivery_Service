import express from 'express';
import usersRouter from './users.router.js';
import authRouter from './auth.router.js';
import searchRouter from './search.router.js';
import orderRouter from './order.router.js';
import ownerRouter from './owner.router.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/search', searchRouter);
router.use('/order', orderRouter);
router.use('/owner',ownerRouter);

export default router;
