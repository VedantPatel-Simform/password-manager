interface EncryptedDEK {
    cipherText: string; // base64-encoded
    iv: string; // base64-encoded (12 bytes, e.g. 96-bit)
}

interface EncPrivateKey {
    cipherText: string; // base64-encoded
    iv: string; // base64-encoded
}

interface RSA {
    publicKey: string; // base64-encoded
    privateKey: EncPrivateKey;
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    salt: string;
    encryptedDEK: EncryptedDEK;
    rsa: RSA;
}
