import { Schema, Document, model, Types } from 'mongoose';
import {
    IUser,
    IEncryptedDEK,
    IEncPrivateKey,
    IRsa,
} from '../interfaces/User.interface.js';

export interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const EncryptedDEKSchema = new Schema<IEncryptedDEK>(
    {
        cipherText: { type: String, required: true },
        iv: { type: String, required: true },
    },
    { _id: false }
);

const EncPrivateKeySchema = new Schema<IEncPrivateKey>(
    {
        cipherText: { type: String, required: true },
        iv: { type: String, required: true },
    },
    { _id: false }
);

const RSASchema = new Schema<IRsa>(
    {
        publicKey: { type: String, required: true },
        privateKey: { type: EncPrivateKeySchema, required: true },
    },
    { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        dek: { type: EncryptedDEKSchema, required: true },
        rsa: { type: RSASchema, required: true },
    },
    {
        timestamps: true,
    }
);

export const User = model<IUserDocument>('User', UserSchema);
