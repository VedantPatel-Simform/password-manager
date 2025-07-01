import { Router } from 'express';
import { authHandler } from '../middlewares/authentication.middleware.js';
import {
    addSharedPassword,
    checkReceiverMail,
    deletePassword,
    editPassword,
    getSentByMePasswords,
    getSharedPasswordDetails,
} from '../controllers/sharePassword.controller.js';
const router = Router();

router.get('/verifymail/:mail', authHandler, checkReceiverMail);
router.post('/', authHandler, addSharedPassword);
router.get('/', authHandler, getSentByMePasswords);
router.get('/:passwordId', authHandler, getSharedPasswordDetails);
router.delete('/:passwordId', authHandler, deletePassword);
router.put('/', authHandler, editPassword);
export default router;
