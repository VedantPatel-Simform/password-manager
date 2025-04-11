import { z } from 'zod';

const nameSchema = z
    .string()
    .min(4, 'Name must be at least 4 characters long.');

const emailSchema = z
    .string()
    .email('The email address provided is not valid.');

// Common password validation
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
    .regex(/\d/, 'Password must include at least one numeric digit.')
    .regex(/[\W_]/, 'Password must include at least one special character.')
    .trim();

// Salt: 16 bytes base64 = 24 characters with trailing '=='
const saltSchema = z
    .string()
    .length(24, 'Salt must be exactly 24 characters (Base64-encoded 16 bytes).')
    .regex(
        /^[A-Za-z0-9+/]{22}==$/,
        'Salt must be a valid Base64 string for 16-byte data.'
    );

// Base64 IV: 12 bytes = 16 characters
const ivSchema = z
    .string()
    .length(16, 'IV must be exactly 16 characters (Base64-encoded 12 bytes).')
    .regex(
        /^[A-Za-z0-9+/]{16}$/,
        'IV is not a valid base64 string (Base64-encoded 12 bytes).'
    );
// Encrypted DEK schema
const encryptedDEKSchema = z.object({
    iv: ivSchema.nonempty(
        'Initialization vector (iv) for encryptedDEK cannot be empty.'
    ),
    cipherText: z
        .string()
        .nonempty('Encrypted cipherText for DEK cannot be empty.'),
});

// RSA schema
const rsaSchema = z.object({
    publicKey: z
        .string()
        .nonempty('RSA publicKey is required and cannot be empty.'),
    privateKey: z
        .object({
            iv: ivSchema
                .nonempty('RSA privateKey.iv must be provided.')
                .refine(
                    (val) => typeof val === 'string',
                    'RSA privateKey.iv must be a string.'
                ),
            cipherText: z
                .string()
                .nonempty('CipherText for RSA privateKey must not be empty.'),
        })
        .refine(
            (val) => typeof val === 'object',
            'RSA privateKey must be a valid object.'
        ),
});

// Register schema
export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    salt: saltSchema,
    encryptedDEK: encryptedDEKSchema,
    rsa: rsaSchema,
});

// Login schema
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
