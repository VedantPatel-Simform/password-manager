import { z } from 'zod';

// Encrypted field schema (for password and optional notes)
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

// Enum for category values
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

// Schema for validating a password item (IPassword)
const passwordItemSchema = z.object({
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
});
export const passwordItemsArraySchema = z
    .array(passwordItemSchema)
    .min(1, 'At least one password entry is required.');
