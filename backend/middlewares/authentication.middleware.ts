import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { verifyJwt } from '../utils/jwt.utils.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { HTTP_STATUS } from '../constants/http.status.js';

export const authHandler = expressAsyncHandler(
    (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.jwt as string;
        if (!token || typeof token !== 'string') {
            throw new ApiError(
                'Authentication required',
                HTTP_STATUS.UNAUTHORIZED.code
            );
        }
        try {
            const decoded = verifyJwt(token);
            req.user = decoded;
            next();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            throw new ApiError(
                'Invalid or expired token',
                HTTP_STATUS.UNAUTHORIZED.code
            );
        }
    }
);
