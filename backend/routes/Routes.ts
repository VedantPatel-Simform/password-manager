import authRouter from './auth.routes.js';
import { Router } from 'express';
const router = Router();

router.use('/authentication', authRouter);

export default router;
