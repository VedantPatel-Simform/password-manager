import { CategoryValue } from './Password.interface.js';

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
}
