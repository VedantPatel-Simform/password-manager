import {
    addPasswordController,
    allPasswordsController,
    deletePasswordController,
    editPasswordController,
    getDeletedPasswords,
    getPassword,
    permenantDeletePassword,
    restorePasswordController,
} from '../controllers/user.controller.js';
import { Router } from 'express';
import { authHandler } from '../middlewares/authentication.middleware.js';
import shareRouter from './passwordShare.routes.js';
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

router.get('/password/get/:passwordId', authHandler, getPassword);

router.get('/password/deletedpasswords', authHandler, getDeletedPasswords);

router.delete(
    '/password/premenantdelete/:passwordId',
    authHandler,
    permenantDeletePassword
);

router.use('/shared', authHandler, shareRouter);

export default router;
