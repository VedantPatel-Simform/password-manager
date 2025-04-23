import express from 'express';
import {
    registerController,
    loginController,
    checkSessionController,
    logoutController,
} from '../controllers/authentication.controller.js';
import { validate } from '../middlewares/zodValidator.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';
const router = express.Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.get('/check-session', checkSessionController);
router.post('/logout', logoutController);
export default router;
