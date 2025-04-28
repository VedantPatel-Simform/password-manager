import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { IPassword } from '../interfaces/Password.interface.js';
import { User } from '../models/User.model.js';
import { Password } from '../models/Password.model.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { HTTP_STATUS } from '../constants/http.status.js';

type PasswordBody = Omit<
    IPassword,
    'deleted' | 'deletedTimeStamp' | 'autoDeleteDate' | 'userId'
>;

export const addPasswordController = expressAsyncHandler(
    async (req: Request<unknown, unknown, PasswordBody>, res: Response) => {
        const { website, userName, password, notes, email, category } =
            req.body;
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            throw new ApiError('User not found', HTTP_STATUS.BAD_REQUEST.code);
        }
        const newPassword = await Password.create({
            userId: user._id.toString(),
            website,
            userName,
            password,
            category,
            notes,
            email,
        });

        res.status(HTTP_STATUS.CREATED.code).json({
            success: true,
            password: newPassword,
        });
    }
);

export const deletePasswordController = expressAsyncHandler(
    async (req: Request<{ passwordId: string }>, res: Response) => {
        const { passwordId } = req.params;
        const password = await Password.findById(passwordId);
        if (!password) {
            throw new ApiError(
                "Password don't exists",
                HTTP_STATUS.BAD_REQUEST.code
            );
        }

        if (password.userId !== req.user.id) {
            throw new ApiError(
                'User not permitted to delete password',
                HTTP_STATUS.UNAUTHORIZED.code
            );
        }

        if (password.deleted) {
            throw new ApiError(
                'Password already deleted',
                HTTP_STATUS.BAD_REQUEST.code
            );
        }

        password.deleted = true;
        password.deletedTimeStamp = new Date();
        const secondsToAdd = process.env.AUTO_DELETE_AFTER_SECONDS;
        password.autoDeleteDate = new Date(Date.now() + secondsToAdd * 1000);

        await password.save();

        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            message: 'Password successfully Deleted',
        });
    }
);

export const restorePasswordController = expressAsyncHandler(
    async (req: Request<{ passwordId: string }>, res: Response) => {
        const { passwordId } = req.params;
        const password = await Password.findById(passwordId);
        if (!password) {
            throw new ApiError(
                "Password don't exists",
                HTTP_STATUS.BAD_REQUEST.code
            );
        }

        if (password.userId !== req.user.id) {
            throw new ApiError(
                'User not permitted to restore password',
                HTTP_STATUS.UNAUTHORIZED.code
            );
        }

        if (!password.deleted) {
            throw new ApiError(
                'Password already restored',
                HTTP_STATUS.BAD_REQUEST.code
            );
        }

        password.deleted = false;
        password.deletedTimeStamp = undefined;
        password.autoDeleteDate = undefined;

        await password.save();

        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            message: 'Password successfully Restored',
        });
    }
);

export const allPasswordsController = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.user;
        const allPasswords = await Password.find({ userId: id });
        if (allPasswords.length === 0) {
            res.status(HTTP_STATUS.OK.code).json({
                success: true,
                message: 'No passwords available yet',
            });
        } else {
            res.status(HTTP_STATUS.OK.code).json({
                success: true,
                passwords: allPasswords,
            });
        }
    }
);

export const editPasswordController = expressAsyncHandler(
    async (
        req: Request<{ passwordId: string }, unknown, PasswordBody>,
        res: Response
    ) => {
        const { passwordId } = req.params;
        const { website, userName, password, notes, email } = req.body;
        const editPassword = await Password.findById(passwordId);
        if (!editPassword) {
            throw new ApiError(
                "Password don't exists",
                HTTP_STATUS.BAD_REQUEST.code
            );
        }

        editPassword.website = website;
        editPassword.userName = userName;
        editPassword.password = password;
        editPassword.notes = notes;
        editPassword.email = email;

        await editPassword.save();

        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            message: 'Successfully updated',
        });
    }
);
