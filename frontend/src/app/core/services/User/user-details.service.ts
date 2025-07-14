import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserDetails {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  private userDetailsSubject: BehaviorSubject<UserDetails | null>;

  constructor() {
    const stored = localStorage.getItem('user');
    const initialDetails = stored ? JSON.parse(stored) : null;
    this.userDetailsSubject = new BehaviorSubject<UserDetails | null>(
      initialDetails
    );
  }

  // Set and store in localStorage automatically
  setUserDetails(details: UserDetails): void {
    localStorage.setItem('user', JSON.stringify(details));
    this.userDetailsSubject.next(details);
  }

  getUserDetails(): Observable<UserDetails | null> {
    return this.userDetailsSubject.asObservable();
  }

  getCurrentUser(): UserDetails | null {
    return this.userDetailsSubject.getValue();
  }

  clearUserDetails(): void {
    localStorage.removeItem('user');
    this.userDetailsSubject.next(null);
  }
}
