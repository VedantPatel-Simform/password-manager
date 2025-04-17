import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { HTTP_STATUS } from '../constants/http.status.js';
import { IRegister, ILogin } from '../interfaces/Auth.interface.js';
import { createJwt, verifyJwt } from '../utils/jwt.utils.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.utils.js';
import argon2 from 'argon2';
export const registerController = expressAsyncHandler(
    async (req: Request<unknown, unknown, IRegister>, res: Response) => {
        const { name, email, password, confirmPassword, salt, dek, rsa } =
            req.body;

        if (password !== confirmPassword) {
            throw new ApiError(
                "Password's do not match",
                HTTP_STATUS.BAD_REQUEST.code
            );
        }

        // const response = await fetch(
        //     `${process.env.PASSWORD_BREACH_ENDPOINT}/check?password=${encodeURIComponent(password)}`
        // );

        // const data = (await response.json()) as {
        //     success: boolean;
        //     breached: boolean;
        // };

        // if (data.breached) {
        //     throw new ApiError(
        //         'This password has been exposed in a data breach. Please choose a different one.',
        //         HTTP_STATUS.BAD_REQUEST.code
        //     );
        // }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(
                'Email already exists!!',
                HTTP_STATUS.CONFLICT.code
            );
        }

        // Hash the password with argon2
        // Argon2id used to protect from GPU and ASIC attacks and currently preferred for high security systems
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
        });

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            salt,
            dek,
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
    async (req: Request<unknown, unknown, ILogin>, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError('Email not found', HTTP_STATUS.NOT_FOUND.code);
        }

        // Compare hashed password
        // Argon2id used to protect from GPU and ASIC attacks and currently preferred for high security systems
        const isPasswordCorrect = await argon2.verify(user.password, password);
        if (!isPasswordCorrect) {
            throw new ApiError(
                'Invalid credentials',
                HTTP_STATUS.UNAUTHORIZED.code
            );
        }

        const token = createJwt({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                salt: user.salt,
                dek: user.dek,
                rsa: user.rsa,
            },
            message: 'Login successful',
        });
    }
);

export const checkSessionController = expressAsyncHandler(
    (req: Request, res: Response) => {
        const token = req.cookies.jwt as string;
        console.log('inside checksession');
        if (!token || typeof token !== 'string') {
            throw new ApiError(
                'Authentication required',
                HTTP_STATUS.UNAUTHORIZED.code
            );
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const decoded = verifyJwt(token);
            res.status(200).json({
                success: true,
                message: 'Verified User',
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            res.status(HTTP_STATUS.UNAUTHORIZED.code).json({
                success: false,
                message: 'Unauthorized User',
            });
        }
    }
);

export const logoutController = expressAsyncHandler(
    (req: Request, res: Response) => {
        res.clearCookie('jwt');
        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            message: 'Logout Successful',
        });
    }
);
