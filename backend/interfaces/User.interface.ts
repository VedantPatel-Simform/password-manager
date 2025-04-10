export interface IEncryptedDEK {
    cipherText: string;
    iv: string; // base64 encoded : 12 bytes
}

export interface IEncPrivateKey {
    cipherText: string;
    iv: string;
}

export interface IRsa {
    publicKey: string;
    privateKey: IEncPrivateKey;
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    salt: string; // base64 encoded : 16 bytes
    dek: IEncryptedDEK;
    rsa: IRsa;
}
