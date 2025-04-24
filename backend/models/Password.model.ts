import { Schema, Document, model, Types } from 'mongoose';
import {
    IPassword,
    IEncryptedField,
} from '../interfaces/Password.interface.js';

export interface IPasswordDocument extends IPassword, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
const encryptedFieldSchema = new Schema<IEncryptedField>(
    {
        cipherText: { type: String, required: true },
        iv: { type: String, required: true },
    },
    {
        _id: false,
    }
);
const passwordSchema = new Schema<IPasswordDocument>(
    {
        userId: { type: String, required: true },
        website: { type: String, required: true },
        userName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: encryptedFieldSchema, required: true },
        notes: { type: encryptedFieldSchema },
        deleted: { type: Boolean, default: false },
        deletedTimeStamp: { type: Date },
        autoDeleteDate: { type: Date },
    },
    {
        timestamps: true,
    }
);

passwordSchema.index(
    { deletedTimeStamp: 1 },
    {
        expireAfterSeconds: process.env.AUTO_DELETE_AFTER_SECONDS,
    }
);
export const Password = model<IPasswordDocument>('Password', passwordSchema);
