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

  constructor(private http: HttpClient) {}

  // Store login status in localStorage
  setLoggedIn(value: boolean): void {
    localStorage.setItem(this.loggedInKey, JSON.stringify(value));
  }

  // Retrieve login status from localStorage
  isLoggedIn(): boolean {
    const value = localStorage.getItem(this.loggedInKey);
    return value ? JSON.parse(value) : false; // Default to false if not set
  }

  // Store registered status in localStorage
  setRegistered(value: boolean): void {
    localStorage.setItem(this.registeredKey, JSON.stringify(value));
  }

  // Retrieve registered status from localStorage
  isRegistered(): boolean {
    const value = localStorage.getItem(this.registeredKey);
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
