import {
    addPasswordController,
    allPasswordsController,
    deletePasswordController,
    editPasswordController,
    restorePasswordController,
} from '../controllers/user.controller.js';
import { Router } from 'express';
import { authHandler } from '../middlewares/authentication.middleware.js';
const router = Router();

router.post('/password/add', authHandler, addPasswordController);
router.delete(
    '/password/delete/:passwordId',
    authHandler,
    deletePasswordController
);
router.patch(
    '/password/restore/:passwordId',
    authHandler,
    restorePasswordController
);
router.get('/password/all', authHandler, allPasswordsController);

router.put('/password/edit/:passwordId', authHandler, editPasswordController);

export default router;
