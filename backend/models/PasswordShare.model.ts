import { Schema, Document, model, Types } from 'mongoose';
import { IPasswordShare } from '../interfaces/PasswordShare.interface.js';
import { IEncryptedField } from '../interfaces/Password.interface.js';

export interface IPasswordShareDocument extends IPasswordShare, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    expireDate?: Date;
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

const passwordSchema = new Schema<IPasswordShareDocument>(
    {
        senderId: { type: String, required: true },
        senderMail: { type: String, required: true },
        senderPublicEncPEK: { type: String, required: true },
        receiverId: { type: String, required: true },
        receiverPublicEncPEK: { type: String, required: true },
        receiverMail: { type: String, required: true },
        website: { type: String, required: true },
        userName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: encryptedFieldSchema, required: true },
        category: { type: String, required: true },
        notes: { type: encryptedFieldSchema },
        expireDate: { type: Date },
    },
    {
        timestamps: true,
    }
);

export const SharedPasswords = model<IPasswordShareDocument>(
    'SharedPasswords',
    passwordSchema
);
