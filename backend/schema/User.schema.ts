import mongoose, { Document, Schema, Model } from 'mongoose';

interface IEncryptedField {
    cipher: string;
    iv: string;
}

interface IRSA {
    publicKey: string;
    privateKey: IEncryptedField;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    salt: string;
    dek: IEncryptedField;
    rsa: IRSA;
    loggedIn: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const EncryptedFieldSchema = new Schema<IEncryptedField>(
    {
        cipher: { type: String, required: true },
        iv: { type: String, required: true },
    },
    { _id: false }
);

const rsaSchema = new Schema<IRSA>(
    {
        publicKey: { type: String, required: true },
        privateKey: { type: EncryptedFieldSchema, required: true },
    },
    { _id: false }
);

const userSchema: Schema<IUser> = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        dek: { type: EncryptedFieldSchema, required: true },
        rsa: { type: rsaSchema, required: true },
        loggedIn: { type: Boolean, required: true },
    },
    { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
