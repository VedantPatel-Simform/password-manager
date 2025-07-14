import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeyStorageService {
  private readonly PUBLIC_KEY = 'rsa_public_key';
  private readonly PRIVATE_KEY = 'rsa_private_key';
  private readonly DEK_KEY = 'dek_key';
  private readonly ENC_KEY = 'encryption_key';

  constructor() {}

  // Setters
  setPublicKey(key: string) {
    localStorage.setItem(this.PUBLIC_KEY, key);
  }

  setPrivateKey(key: string) {
    localStorage.setItem(this.PRIVATE_KEY, key);
  }

  setDekKey(key: string) {
    localStorage.setItem(this.DEK_KEY, key);
  }

  setEncryptionKey(key: string) {
    localStorage.setItem(this.ENC_KEY, key);
  }

  // Getters
  getPublicKey(): string | null {
    return localStorage.getItem(this.PUBLIC_KEY);
  }

  getPrivateKey(): string | null {
    return localStorage.getItem(this.PRIVATE_KEY);
  }

  getDekKey(): string | null {
    return localStorage.getItem(this.DEK_KEY);
  }

  getEncryptionKey(): string | null {
    return localStorage.getItem(this.ENC_KEY);
  }

  // Clear all keys
  clearAllKeys() {
    localStorage.removeItem(this.PUBLIC_KEY);
    localStorage.removeItem(this.PRIVATE_KEY);
    localStorage.removeItem(this.DEK_KEY);
    localStorage.removeItem(this.ENC_KEY);
  }
}
