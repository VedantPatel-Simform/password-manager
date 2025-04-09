import { Schema, Document, model } from 'mongoose';

interface EncryptedDEK {
    cipherText: string;
    iv: string;
}

interface EncPrivateKey {
    cipherText: string;
    iv: string;
}

interface RSA {
    publicKey: string;
    privateKey: EncPrivateKey;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    salt: string;
    dek: EncryptedDEK;
    rsa: RSA;
}

// ✅ Disable _id for nested objects
const EncryptedDEKSchema = new Schema<EncryptedDEK>(
    {
        cipherText: { type: String, required: true },
        iv: { type: String, required: true },
    },
    { _id: false }
);

const EncPrivateKeySchema = new Schema<EncPrivateKey>(
    {
        cipherText: { type: String, required: true },
        iv: { type: String, required: true },
    },
    { _id: false }
);

const RSASchema = new Schema<RSA>(
    {
        publicKey: { type: String, required: true },
        privateKey: { type: EncPrivateKeySchema, required: true },
    },
    { _id: false }
);

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    dek: { type: EncryptedDEKSchema, required: true },
    rsa: { type: RSASchema, required: true },
});

export const User = model<IUser>('User', UserSchema);
