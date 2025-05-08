import { Router } from 'express';
import { authHandler } from '../middlewares/authentication.middleware.js';
import {
    addSharedPassword,
    checkReceiverMail,
    getSentByMePasswords,
} from '../controllers/sharePassword.controller.js';
const router = Router();

router.get('/verifymail/:mail', authHandler, checkReceiverMail);
router.post('/sharepassword', authHandler, addSharedPassword);
router.get('/shared', getSentByMePasswords);

export default router;
