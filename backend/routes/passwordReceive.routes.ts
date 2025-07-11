import { Router } from 'express';
import { getReceivedByMePasswords } from '../controllers/sharePassword.controller.js';
const router = Router();

router.get('/', getReceivedByMePasswords);
export default router;
