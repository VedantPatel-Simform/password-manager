import { addPasswordController } from '../controllers/user.controller.js';
import { Router } from 'express';
import { authHandler } from '../middlewares/authentication.middleware.js';
const router = Router();

router.post('/addpassword', authHandler, addPasswordController);

export default router;
