import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { IPassword } from '../interfaces/Password.interface.js';
import { User } from '../models/User.model.js';
import { Password } from '../models/Password.model.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { HTTP_STATUS } from '../constants/http.status.js';

export const addPasswordController = expressAsyncHandler(
    async (
        req: Request<
            unknown,
            unknown,
            Omit<
                IPassword,
                'deleted' | 'deletedTimeStamp' | 'autoDeleteDate' | 'userId'
            >
        >,
        res: Response
    ) => {
        const { website, userName, password, notes, email } = req.body;
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
            notes,
            email,
        });

        console.log(newPassword);

        res.status(HTTP_STATUS.CREATED.code).json({
            success: true,
            password: newPassword,
        });
    }
);
