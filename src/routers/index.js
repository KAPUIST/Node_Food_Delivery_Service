import express from 'express';
import usersRouter from './users.router.js';
import authRouter from './auth.router.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

export default router;
