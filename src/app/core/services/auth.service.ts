// src/app/core/services/auth.service.ts

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import {
  IUser,
  IRegisterRequest,
  ILoginRequest,
  IAuthResponse
} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'https://carnest.runasp.net/api/Account';

  currentUser = signal<IUser | null>(null);

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.mapTokenToUser(token);
      this.currentUser.set(user);
    }
  }

  registerCustomer(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register/customer`, data).pipe(
      map(res => this.mapTokenToUser(res.token)),
      tap(user => this.handleSuccess(user))
    );
  }
  registerVendor(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register/vendor`, data).pipe(
      map(res => this.mapTokenToUser(res.token)),
      tap(user => this.handleSuccess(user))
    );
  }

  login(credentials: ILoginRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(res => this.mapTokenToUser(res.token)),
      tap(user => this.handleSuccess(user))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private handleSuccess(user: IUser) {
    localStorage.setItem('token', user.token);
    this.currentUser.set(user);
  }

  get token(): string | null {
    return this.currentUser()?.token || null;
  }

  private mapTokenToUser(token: string): IUser {
    const decoded: any = jwtDecode(token);
    console.log('Decoded Token:', decoded);

    return {
      id:
        decoded.userId ||
        decoded.sub ||
        decoded.nameid ||
        '',
      firstName: decoded.firstName || decoded.given_name || '',
      lastName: decoded.lastName || decoded.family_name || '',
      email: decoded.email || '',
      nationalId: decoded.nationalId || '',
      address: decoded.address || '',
      createdDate: decoded.createdDate || decoded.createdAt || new Date().toISOString(),
      role: (decoded.role ||
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        'Customer') as any,
      phoneNumber: decoded.phoneNumber,
      token
    };
  }
}
