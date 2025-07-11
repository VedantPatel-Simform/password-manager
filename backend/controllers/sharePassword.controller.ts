import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { CategoryValue } from '../interfaces/Password.interface.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { HTTP_STATUS } from '../constants/http.status.js';
import { SharedPasswords } from '../models/PasswordShare.model.js';
import { IEditSharedPassword } from '../interfaces/PasswordShare.interface.js';

type SharedPasswordBody = {
    receiverMail: string;
    receiverPublicEncPEK: string;

    senderPublicEncPEK: string;

    website: string;
    userName: string;
    email: string;
    password: {
        cipherText: string;
        iv: string;
    };
    category: CategoryValue;
    notes?: {
        cipherText: string;
        iv: string;
    };
    expireDate?: Date;
};

export const checkReceiverMail = expressAsyncHandler(
    async (req: Request<{ mail: string }, unknown, unknown>, res: Response) => {
        const { mail } = req.params;
        console.log(mail);
        const receiver = await User.findOne({ email: mail });
        if (!receiver) {
            throw new ApiError(
                'Receiver email not found',
                HTTP_STATUS.NOT_FOUND.code
            );
        }

        res.status(HTTP_STATUS.OK.code).json({
            receiver: {
                publicKey: receiver.rsa.publicKey,
            },
            success: true,
        });
    }
);

export const addSharedPassword = expressAsyncHandler(
    async (
        req: Request<unknown, unknown, SharedPasswordBody>,
        res: Response
    ) => {
        const {
            receiverMail,
            receiverPublicEncPEK,
            senderPublicEncPEK,

            website,
            userName,
            email,
            password,
            notes,
            expireDate,
            category,
        } = req.body;
        const receiver = await User.findOne({ email: receiverMail });
        if (!receiver) {
            throw new ApiError(
                'Receiver email not found',
                HTTP_STATUS.NOT_FOUND.code
            );
        }

        const createdPassword = await SharedPasswords.create({
            receiverId: receiver._id.toString(),
            receiverMail,
            receiverPublicEncPEK,

            senderId: req.user.id,
            senderMail: req.user.email,
            senderPublicEncPEK,

            website,
            userName,
            email,
            password,
            notes,
            expireDate,
            category,
        });

        console.log(createdPassword);

        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            message: 'Successfully Shared',
        });
    }
);

export const getSentByMePasswords = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.user;
        const SentByMePasswords = await SharedPasswords.find({ senderId: id });
        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            passwords: SentByMePasswords,
        });
    }
);

export const getSharedPasswordDetails = expressAsyncHandler(
    async (req: Request<{ passwordId: string }>, res: Response) => {
        const passwordId = req.params.passwordId;
        const SharedPasswordDetails =
            await SharedPasswords.findById(passwordId);
        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            password: SharedPasswordDetails,
        });
    }
);

export const deletePassword = expressAsyncHandler(
    async (req: Request<{ passwordId: string }>, res: Response) => {
        const passwordId = req.params.passwordId;
        await SharedPasswords.findByIdAndDelete(passwordId);
        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            message: 'Password successfully Deleted',
        });
    }
);

export const editPassword = expressAsyncHandler(
    async (
        req: Request<unknown, unknown, IEditSharedPassword>,
        res: Response
    ) => {
        const body = req.body;
        const password = await SharedPasswords.findById(body._id);
        if (!password) {
            throw new ApiError(
                'Password not found',
                HTTP_STATUS.NOT_FOUND.code
            );
        }
        password.senderId = body.senderId;
        password.senderPublicEncPEK = body.senderPublicEncPEK;
        password.senderMail = body.senderMail;
        password.receiverId = body.receiverId;
        password.receiverPublicEncPEK = body.receiverPublicEncPEK;
        password.receiverMail = body.receiverMail;
        password.website = body.website;
        password.email = body.email;
        password.userName = body.userName;
        password.category = body.category;
        password.password = body.password;
        if (body.notes) {
            password.notes = body.notes;
        }
        password.expireDate = body.expireDate;
        const newPassword = await password.save();
        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            newPassword,
        });
    }
);

// received by me
export const getReceivedByMePasswords = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.user;
        const SentByMePasswords = await SharedPasswords.find({
            receiverId: id,
        });
        res.status(HTTP_STATUS.OK.code).json({
            success: true,
            passwords: SentByMePasswords,
        });
    }
);
