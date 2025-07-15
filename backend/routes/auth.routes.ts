import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    registerController,
    loginController,
    checkSessionController,
    logoutController,
} from '../controllers/authentication.controller.js';
import { validate } from '../middlewares/zodValidator.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 5 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.',
            statusCode: 429,
        });
    },
});

router.post(
    '/register',
    authLimiter,
    validate(registerSchema),
    registerController
);
router.post('/login', authLimiter, validate(loginSchema), loginController);

router.get('/check-session', checkSessionController);
router.post('/logout', logoutController);

export default router;
