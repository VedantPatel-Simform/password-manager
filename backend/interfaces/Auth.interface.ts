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

export interface IRegister {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    salt: string; // base64 - encoded 16 bytes
    encryptedDEK: EncryptedDEK;
    rsa: RSA;
}

export interface ILogin {
    email: string;
    password: string;
}
