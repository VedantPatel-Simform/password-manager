import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { HTTP_STATUS } from '../constants/http.status.js';

// Reusable Zod validator middleware
export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.errors[0];
            res.status(HTTP_STATUS.BAD_REQUEST.code).json({
                error: 'Validation failed',
                msg: firstError.message,
                path: firstError.path.join('.'),
            });
            return;
        }

        next();
    };
