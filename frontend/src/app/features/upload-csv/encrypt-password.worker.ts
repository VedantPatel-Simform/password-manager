/// <reference lib="webworker" />

import {
  EncryptedPasswordBody,
  IPasswordCsvItem,
} from '../../shared/interfaces/password.interface';

function isCsvPasswordType(list: any[]): list is IPasswordCsvItem[] {
  return list.every((item: any) => {
    // Check required fields exist and have correct types
    const hasRequiredFields =
      typeof item.website === 'string' &&
      typeof item.userName === 'string' &&
      typeof item.email === 'string' &&
      typeof item.password === 'string' &&
      typeof item.category === 'string';

    // Check optional field if it exists
    const hasValidNotes =
      item.notes === undefined ||
      item.notes === null ||
      typeof item.notes === 'string';

    return hasRequiredFields && hasValidNotes;
  });
}

async function encryptPassword(
  key: string,
  password: IPasswordCsvItem
): Promise<EncryptedPasswordBody> {
  const encPass = await encryptWithBase64Key(key, password.password);
  const encNotes =
    password.notes !== undefined
      ? await encryptWithBase64Key(key, password.notes)
      : undefined;

  return {
    ...password,
    password: encPass,
    notes: encNotes,
  };
}

addEventListener('message', async ({ data }) => {
  if (typeof data.key === 'string' && Array.isArray(data.passwords)) {
    const passwords = data.passwords;
    const key = data.key;
    if (isCsvPasswordType(passwords)) {
      const encPasswordPromise = passwords.map((item) =>
        encryptPassword(key, item)
      );
      const encPasswords = await Promise.all(encPasswordPromise);
      console.log('in worker ', encPasswords);
      postMessage(encPasswords);
    } else {
      throw new Error('Password type error');
    }
  } else {
    throw new Error('Error in parsing the arguments');
  }
});

// utility function worker compatible
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

async function importAesKeyFromBase64(base64Key: string): Promise<CryptoKey> {
  const rawKey = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

// Main encryption function
async function encryptWithBase64Key(
  base64Key: string,
  plainText: string
): Promise<{
  cipherText: string;
  iv: string;
}> {
  try {
    const key = await importAesKeyFromBase64(base64Key);
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
    const encodedText = encoder.encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
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
  } catch (error) {
    throw new Error(
      `Encryption failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
