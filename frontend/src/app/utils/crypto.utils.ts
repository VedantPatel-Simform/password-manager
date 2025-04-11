export async function generateRSAKeyPair(): Promise<{
  privateKeyPem: string;
  publicKeyPem: string;
}> {
  // Generate RSA key pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048, // Note: 1024 is OK for testing, but 2048+ is recommended for production
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  // Export the public key to PEM format
  const publicKeyBuffer = await window.crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  );
  const publicKeyPem = arrayBufferToPem(publicKeyBuffer, 'PUBLIC KEY');

  // Export the private key to PEM format
  const privateKeyBuffer = await window.crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  );
  const privateKeyPem = arrayBufferToPem(privateKeyBuffer, 'PRIVATE KEY');

  return {
    privateKeyPem,
    publicKeyPem,
  };
}

// Utility function to convert ArrayBuffer to PEM format
function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  const base64 = window.btoa(binary);
  const formattedBase64 = base64.match(/.{1,64}/g)?.join('\n') ?? base64;

  return `-----BEGIN ${label}-----\n${formattedBase64}\n-----END ${label}-----`;
}

// Utility: Convert PEM to CryptoKey
async function importKey(pem: string, isPrivate: boolean): Promise<CryptoKey> {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const binary = window.atob(b64);
  const buffer = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));

  return window.crypto.subtle.importKey(
    isPrivate ? 'pkcs8' : 'spki',
    buffer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    isPrivate ? ['decrypt'] : ['encrypt']
  );
}

// Encrypt using public key and return Base64-encoded string
export async function encryptWithPublicKey(
  publicKeyPem: string,
  message: string
): Promise<string> {
  const publicKey = await importKey(publicKeyPem, false);
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encodedMessage
  );

  return arrayBufferToBase64(encryptedBuffer);
}

// Decrypt Base64-encoded encrypted string using private key
export async function decryptWithPrivateKey(
  privateKeyPem: string,
  base64Data: string
): Promise<string> {
  const privateKey = await importKey(privateKeyPem, true);
  const encryptedBuffer = base64ToArrayBuffer(base64Data);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedBuffer
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return window.btoa(binary);
}

// Convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const buffer = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
  return buffer.buffer;
}

export async function generateBase64KeyFromPassword(password: string): Promise<{
  key: string;
  salt: string;
}> {
  const encoder = new TextEncoder();
  const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));

  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    passwordKey,
    256 // bits
  );

  return {
    key: arrayBufferToBase64(derivedBits),
    salt: arrayBufferToBase64(saltBytes.buffer),
  };
}

export async function generateBase64KeyFromPasswordAndSalt(
  password: string,
  saltBase64: string
): Promise<string> {
  const encoder = new TextEncoder();
  const saltBytes = new Uint8Array(base64ToArrayBuffer(saltBase64));

  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  return arrayBufferToBase64(derivedBits);
}

export async function encryptWithBase64Key(
  base64Key: string,
  plainText: string
): Promise<{
  cipherText: string;
  iv: string;
}> {
  const key = await importAesKeyFromBase64(base64Key);
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const encodedText = encoder.encode(plainText);

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedText
  );

  return {
    cipherText: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

export async function decryptWithBase64Key(
  base64Key: string,
  encryptedKey: {
    cipherText: string;
    iv: string;
  }
): Promise<string> {
  const key = await importAesKeyFromBase64(base64Key);
  const iv = new Uint8Array(base64ToArrayBuffer(encryptedKey.iv));
  const encrypted = base64ToArrayBuffer(encryptedKey.cipherText);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encrypted
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

async function importAesKeyFromBase64(base64Key: string): Promise<CryptoKey> {
  const rawKey = base64ToArrayBuffer(base64Key);
  return window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export function calculatePasswordEntropy(password: string): number {
  let charsetSize = 0;

  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32; // symbols/punctuation etc.

  if (charsetSize === 0) return 0;

  const entropy = password.length * Math.log2(charsetSize);
  return Math.round(entropy * 100) / 100; // rounded to 2 decimal places
}

export function generateRandomBase64AesKey(): string {
  const keyBytes = window.crypto.getRandomValues(new Uint8Array(32)); // 256 bits = 32 bytes
  return arrayBufferToBase64(keyBytes.buffer);
}
