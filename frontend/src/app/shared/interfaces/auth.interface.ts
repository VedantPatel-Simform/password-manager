import { ICryptoData } from './crypto-data.interface';

export interface IRegisterData extends ICryptoData {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface ILoginData {
  name: string;
  email: string;
}

export interface IRegisterResponse {
  success: boolean;
  message: string;
}

export interface ILoginResponse {
  success: boolean;
  user: {
    name: string;
    email: string;
    salt: string;
    dek: {
      cipherText: string;
      iv: string;
    };
    rsa: {
      publicKey: string;
      privateKey: {
        cipherText: string;
        iv: string;
      };
    };
  };
  message: string;
}
export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  path: string;
}
