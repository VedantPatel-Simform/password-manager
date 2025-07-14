import { Router } from 'express';

import {
    addSharedPassword,
    checkReceiverMail,
    deletePassword,
    editPassword,
    getSentByMePasswords,
    getSharedPasswordDetails,
} from '../controllers/sharePassword.controller.js';
const router = Router();

router.get('/verifymail/:mail', checkReceiverMail);
router.post('/', addSharedPassword);
router.get('/', getSentByMePasswords);
router.get('/:passwordId', getSharedPasswordDetails);
router.delete('/:passwordId', deletePassword);
router.put('/', editPassword);
export default router;
