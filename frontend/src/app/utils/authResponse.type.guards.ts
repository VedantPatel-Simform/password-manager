import {
  ILoginResponse,
  ErrorResponse,
  ValidationErrorResponse,
  IRegisterResponse,
} from '../shared/interfaces/auth.interface';

export function isLoginResponse(obj: any): obj is ILoginResponse {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.success === 'boolean' &&
    typeof obj.message === 'string' &&
    obj.user &&
    typeof obj.user.name === 'string' &&
    typeof obj.user.email === 'string' &&
    typeof obj.user.salt === 'string' &&
    obj.user.dek &&
    typeof obj.user.dek.cipherText === 'string' &&
    typeof obj.user.dek.iv === 'string' &&
    obj.user.rsa &&
    typeof obj.user.rsa.publicKey === 'string' &&
    obj.user.rsa.privateKey &&
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
