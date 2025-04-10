import { StringValue } from 'ms';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            JWT_SECRET_KEY: string;
            JWT_EXPIRE_TIME: StringValue;
            NODE_ENV: 'production' | 'development';
            MONGO_URI: string;
        }
    }
}

declare global {
    namespace Express {
        interface Request {
            cookies: {
                jwt: string;
            };

            user?: {
                id?: string;
                name?: string;
                email?: string;
            };
        }
        interface Response {
            cookies: {
                jwt: string;
            };
        }
    }
}

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        id: string;
        name: string;
        email: string;
    }
}

export {};
