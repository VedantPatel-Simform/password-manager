import { z } from 'zod';

// Reuse from earlier
const encryptedFieldSchema = z.object({
    cipherText: z.string().nonempty('Encrypted cipherText is required.'),
    iv: z
        .string()
        .length(
            16,
            'IV must be exactly 16 characters (Base64-encoded 12 bytes).'
        )
        .regex(
            /^[A-Za-z0-9+/]{16}$/,
            'IV must be a valid Base64-encoded string of 12 bytes.'
        ),
});

const categorySchema = z.enum([
    'social_media',
    'work_professional',
    'banking_finance',
    'entertainment',
    'personal',
    'education',
    'shopping_ecommerce',
    'health_fitness',
    'travel_tourism',
    'other',
]);

export const sharedPasswordSchema = z.object({
    receiverMail: z
        .string()
        .email('A valid receiver email address is required.'),

    receiverPublicEncPEK: z
        .string()
        .min(1, 'Receiver public encrypted PEK is required.'),

    senderPublicEncPEK: z
        .string()
        .min(1, 'Sender public encrypted PEK is required.'),

    website: z
        .string()
        .min(1, 'Website is required.')
        .max(255, 'Website name must be at most 255 characters.'),

    userName: z
        .string()
        .min(1, 'Username is required.')
        .max(255, 'Username must be at most 255 characters.'),

    email: z.string().email('A valid email address is required.'),

    password: encryptedFieldSchema,

    category: categorySchema,

    notes: encryptedFieldSchema.optional(),

    expireDate: z
        .union([z.string().datetime(), z.date()])
        .optional()
        .refine((val) => !val || new Date(val).getTime() > Date.now(), {
            message: 'Expire date must be in the future if provided.',
        }),
});
