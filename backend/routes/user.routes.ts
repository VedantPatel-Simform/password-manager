import {
    addPasswordsController,
    allPasswordsController,
    deleteAllPasswordsController,
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
import receiveRouter from './passwordReceive.routes.js';
import { passwordItemsArraySchema } from '../validators/password.validators.js';
import { validate } from '../middlewares/zodValidator.middleware.js';
const router = Router();

router.post(
    '/password/add',
    authHandler,
    validate(passwordItemsArraySchema),
    addPasswordsController
);
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

router.delete(
    '/password/deleteAll/:userId',
    authHandler,
    deleteAllPasswordsController
);

router.use('/shared', authHandler, shareRouter);
router.use('/received', authHandler, receiveRouter);

export default router;
