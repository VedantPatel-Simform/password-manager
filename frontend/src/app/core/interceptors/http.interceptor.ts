import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'http://localhost:3000';
  const modifiedReq = req.clone({
    url: `${baseUrl}${req.url}`,
  });
  return next(modifiedReq);
};
