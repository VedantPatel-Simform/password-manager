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
