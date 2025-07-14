import { Router } from 'express';
import {
    getReceivedByMePasswords,
    getSharedPasswordDetails,
} from '../controllers/sharePassword.controller.js';
const router = Router();

router.get('/', getReceivedByMePasswords);
router.get('/:passwordId', getSharedPasswordDetails);
export default router;
