export interface IEncryptedField {
    cipherText: string;
    iv: string; // base64 encoded : 12 bytes
}
export interface IPassword {
    userId: string;
    website: string;
    userName: string;
    email: string;
    password: IEncryptedField;
    notes?: IEncryptedField;
    deleted: boolean;
    deletedTimeStamp?: Date;
    autoDeleteDate?: Date;
}
