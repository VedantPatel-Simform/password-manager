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

export const addPasswordsController = expressAsyncHandler(
    async (req: Request<unknown, unknown, PasswordBody[]>, res: Response) => {
        const passwords = req.body;
        const { id } = req.user;

        // Validate input is an array
        if (!Array.isArray(passwords)) {
            throw new ApiError(
                'Input should be an array of passwords',
                HTTP_STATUS.BAD_REQUEST.code
            );
        }

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError('User not found', HTTP_STATUS.BAD_REQUEST.code);
        }

        // Add userId to each password and validate required fields
        const passwordsToCreate = passwords.map((password) => {
            if (
                !password.website ||
                !password.userName ||
                !password.password ||
                !password.email
            ) {
                throw new ApiError(
                    'All passwords must contain website, userName, password, and email',
                    HTTP_STATUS.BAD_REQUEST.code
                );
            }

            return {
                userId: user._id.toString(),
                website: password.website,
                userName: password.userName,
                password: password.password,
                category: password.category,
                notes: password.notes,
                email: password.email.toLowerCase(),
            };
        });

        const createdPasswords = await Password.insertMany(passwordsToCreate);

        res.status(HTTP_STATUS.CREATED.code).json({
            success: true,
            message: `${createdPasswords.length} passwords added successfully`,
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
        const allPasswords = await Password.find({
            userId: id,
            deleted: false,
        });

        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            passwords: allPasswords,
        });
    }
);

export const editPasswordController = expressAsyncHandler(
    async (
        req: Request<{ passwordId: string }, unknown, PasswordBody>,
        res: Response
    ) => {
        const { passwordId } = req.params;
        const { website, userName, password, notes, email, category } =
            req.body;
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
        editPassword.category = category;

        await editPassword.save();

        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            message: 'Successfully updated',
        });
    }
);

export const getPassword = expressAsyncHandler(
    async (
        req: Request<{ passwordId: string }, unknown, unknown>,
        res: Response
    ) => {
        const { passwordId } = req.params;
        const password = await Password.findById(passwordId);
        if (!password) {
            throw new ApiError(
                'Password not found',
                HTTP_STATUS.NOT_FOUND.code
            );
        }

        res.status(200).json({
            success: true,
            password,
        });
    }
);

export const getDeletedPasswords = expressAsyncHandler(
    async (req: Request<unknown, unknown, unknown>, res: Response) => {
        const passwords = await Password.find({
            userId: req.user.id,
            deleted: true,
            autoDeleteDate: { $gt: new Date() }, // delete date > current date
        });

        res.status(200).json({
            success: true,
            passwords,
        });
    }
);

export const permenantDeletePassword = expressAsyncHandler(
    async (
        req: Request<{ passwordId: string }, unknown, unknown>,
        res: Response
    ) => {
        const { passwordId } = req.params;
        const password = await Password.findByIdAndDelete(passwordId);

        if (!password) {
            throw new ApiError(
                'Password not found',
                HTTP_STATUS.NOT_FOUND.code
            );
        }

        res.status(200).json({
            success: true,
            message: 'Password permenantly deleted',
        });
    }
);

export const deleteAllPasswordsController = expressAsyncHandler(
    async (req: Request<{ userId: string }>, res: Response) => {
        const { userId } = req.params;

        const result = await Password.deleteMany({
            userId: userId,
            // remove the below comment after testing
            // deleted: true,
        });

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} passwords`,
        });
    }
);
