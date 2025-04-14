import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IRegisterResponse,
  ILoginResponse,
  ValidationErrorResponse,
  ErrorResponse,
  IRegisterData,
  ILoginData,
} from '../../../shared/interfaces/auth.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = false;
  constructor(private http: HttpClient) {}

  setLoggedIn(value: boolean) {
    this.loggedIn = value;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  login(
    data: ILoginData
  ): Observable<IRegisterResponse | ValidationErrorResponse | ErrorResponse> {
    return this.http.post<
      IRegisterResponse | ErrorResponse | ValidationErrorResponse
    >('/authentication/login', data);
  }

  register(
    data: IRegisterData
  ): Observable<ILoginResponse | ErrorResponse | ValidationErrorResponse> {
    return this.http.post<
      ILoginResponse | ErrorResponse | ValidationErrorResponse
    >('/authentication/register', data);
  }
}
