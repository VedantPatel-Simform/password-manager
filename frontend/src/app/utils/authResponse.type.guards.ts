import {
  ILoginResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from '../shared/interfaces/auth.interface';

export function isLoginResponse(res: any): res is ILoginResponse {
  return res && res.success === true && typeof res.user === 'object';
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
