import express from 'express';
import usersRouter from './users.router.js';
import authRouter from './auth.router.js';
import searchRouter from './search.router.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/search', searchRouter);

export default router;
