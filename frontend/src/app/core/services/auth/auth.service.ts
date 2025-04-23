import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ILoginResponse,
  IRegisterData,
  ILoginData,
} from '../../../shared/interfaces/auth.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInKey = 'loggedIn'; // Key for localStorage
  private registeredKey = 'registered'; // Key for localStorage
  private logoutKey = 'loggedOut';
  private comingFrom: 'dashboard' | 'register' | 'login' | null = null;
  constructor(private http: HttpClient) {}

  setComingFrom(val: 'dashboard' | 'register' | 'login' | null) {
    this.comingFrom = val;
  }

  getComingFrom() {
    return this.comingFrom;
  }

  login(data: ILoginData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/authentication/login', data);
  }

  register(data: IRegisterData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/authentication/register', data);
  }

  logout() {
    return this.http.post<{ success: boolean; message: string }>(
      '/authentication/logout',
      {}
    );
  }
}
