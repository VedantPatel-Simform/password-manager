import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { HTTP_STATUS } from '../constants/http.status.js';
import { IUser } from '../interfaces/User.interface.js';
import { createJwt } from '../utils/jwt.utils.js';
import { User } from '../models/User.schema.js';
import { ApiError } from '../utils/ApiError.utils.js';

export const registerController = expressAsyncHandler(
    async (req: Request<unknown, unknown, IUser>, res: Response) => {
        const { name, email, password, salt, encryptedDEK, rsa } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(
                'Email already exists!!',
                HTTP_STATUS.CONFLICT.code
            );
        }

        const newUser = await User.create({
            name,
            email,
            password,
            salt,
            dek: encryptedDEK,
            rsa,
        });

        console.log(newUser);

        res.status(HTTP_STATUS.CREATED.code).json({
            success: true,
            message: 'Registration Successful',
        });
    }
);

export const loginController = expressAsyncHandler(
    (
        req: Request<unknown, unknown, { email: string; password: string }>,
        res: Response
    ) => {
        console.log(req.cookies.jwt);
        const { email, password } = req.body;
        const token = createJwt({
            email,
            id: 'userid1',
            name: 'vedant patel',
        });
        res.cookie('jwt', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
        });

        res.status(HTTP_STATUS.OK.code).json({
            message: HTTP_STATUS.OK.message,
            success: true,
            data: {
                email,
                password,
            },
        });
    }
);
