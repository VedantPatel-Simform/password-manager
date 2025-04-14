import {
  ILoginResponse,
  ErrorResponse,
  ValidationErrorResponse,
  IRegisterResponse,
} from '../shared/interfaces/auth.interface';

export function isLoginResponse(res: any): res is ILoginResponse {
  return (
    res &&
    res.success === true &&
    typeof res.user === 'object' &&
    typeof res.message === 'string'
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
