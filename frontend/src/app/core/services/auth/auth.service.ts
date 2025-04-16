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
  private loggedInKey = 'loggedIn'; // Key for sessionStorage
  private registeredKey = 'registered'; // Key for sessionStorage

  constructor(private http: HttpClient) {}

  // Store login status in sessionStorage
  setLoggedIn(value: boolean): void {
    sessionStorage.setItem(this.loggedInKey, JSON.stringify(value));
  }

  // Retrieve login status from sessionStorage
  isLoggedIn(): boolean {
    const value = sessionStorage.getItem(this.loggedInKey);
    return value ? JSON.parse(value) : false; // Default to false if not set
  }

  // Store registered status in sessionStorage
  setRegistered(value: boolean): void {
    sessionStorage.setItem(this.registeredKey, JSON.stringify(value));
  }

  // Retrieve registered status from sessionStorage
  isRegistered(): boolean {
    const value = sessionStorage.getItem(this.registeredKey);
    console.log('Registered method called');
    return value ? JSON.parse(value) : false; // Default to false if not set
  }

  login(data: ILoginData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/authentication/login', data);
  }

  register(data: IRegisterData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/authentication/register', data);
  }
}
