import {
  ILoginResponse,
  ErrorResponse,
  ValidationErrorResponse,
  IRegisterResponse,
} from '../shared/interfaces/auth.interface';

export function isLoginResponse(obj: any): obj is ILoginResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean' &&
    typeof obj.message === 'string' &&
    typeof obj.user === 'object' &&
    obj.user !== null &&
    typeof obj.user.salt === 'string' &&
    typeof obj.user.dek === 'object' &&
    obj.user.dek !== null &&
    typeof obj.user.dek.cipherText === 'string' &&
    typeof obj.user.dek.iv === 'string' &&
    typeof obj.user.rsa === 'object' &&
    obj.user.rsa !== null &&
    typeof obj.user.rsa.publicKey === 'string' &&
    typeof obj.user.rsa.privateKey === 'object' &&
    obj.user.rsa.privateKey !== null &&
    typeof obj.user.rsa.privateKey.cipherText === 'string' &&
    typeof obj.user.rsa.privateKey.iv === 'string'
  );
}

export function isErrorResponse(res: any): res is ErrorResponse {
  return res && res.success === false && typeof res.statusCode === 'number';
}

export function isValidationErrorResponse(
  res: any
): res is ValidationErrorResponse {
  return (
    res &&
    typeof res.error === 'string' &&
    typeof res.msg === 'string' &&
    typeof res.path === 'string'
  );
}

export function isRegisterResponse(res: any): res is IRegisterResponse {
  return res && res.success === true && typeof res.message === 'string';
}
