import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.utils.js';

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    const status = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        message,
        statusCode: status,
    });
};
