import { inject, Injectable, signal } from '@angular/core';
import { IRegisterRequest, IUser } from '../../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  private apiUrl = 'http://localhost:3000/api/auth';

  currentUser = signal<IUser | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  register(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleSuccess(res))
    );
  }

  login(credentials: any): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleSuccess(res))
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
 
  private handleSuccess(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  get token(): string | null {
    return this.currentUser()?.token || null;
  }
}
