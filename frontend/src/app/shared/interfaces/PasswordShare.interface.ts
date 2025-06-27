import { CategoryValue, PasswordBody } from './password.interface';

type ChangeTypes<T, K extends keyof T, U> = {
  [P in keyof T]: P extends K ? U : T[P];
};

export interface IPasswordShare {
  senderId: string;
  senderPublicEncPEK: string;
  senderMail: string;
  receiverId: string;
  receiverPublicEncPEK: string;
  receiverMail: string;
  website: string;
  email: string;
  userName: string;
  category: CategoryValue;
  password: {
    cipherText: string;
    iv: string;
  };
  notes: {
    cipherText: string;
    iv: string;
  };
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  expireDate?: Date;
}

export type SharedPasswordBody = {
  receiverMail: string;
  website: string;
  userName: string;
  email: string;
  password: string;
  category: {
    label: string;
    value: CategoryValue;
  };
  notes?: string;
  expireDate?: Date;
};

export type SharedPasswordSendBody = {
  senderPublicEncPEK: string;
  receiverPublicEncPEK: string;
  receiverMail: string;
  website: string;
  email: string;
  userName: string;
  category: CategoryValue;
  expireDate?: Date;
  password: {
    cipherText: string;
    iv: string;
  };
  notes?: {
    cipherText: string;
    iv: string;
  };
};

export interface IDecryptedPasswordShare {
  senderId: string;
  senderPublicEncPEK: string;
  senderMail: string;
  receiverId: string;
  receiverPublicEncPEK: string;
  receiverMail: string;
  website: string;
  email: string;
  userName: string;
  category: CategoryValue;
  password: string;
  notes: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  expireDate?: Date;
}
