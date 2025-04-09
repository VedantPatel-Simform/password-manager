import jwt, { JwtPayload } from 'jsonwebtoken';

export const createJwt = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return token;
};

export const verifyJwt = (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
    return decoded;
};
