import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import { Router } from 'express';
const router = Router();

router.use('/authentication', authRouter);
router.use('/user', userRouter);

export default router;
