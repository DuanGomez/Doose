import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiResponse, AuthResponse } from '../models/models';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';
  currentUser = signal<AuthResponse | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router, private cartService: CartService) {}

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API}/login`, { email, password }).pipe(
      tap(res => this.setSession(res.data))
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API}/register`, { name, email, password }).pipe(
      tap(res => this.setSession(res.data))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.cartService.clear();
    this.router.navigate(['/']);
  }

  isLoggedIn() { return !!this.currentUser(); }
  isAdmin()    { return this.currentUser()?.role === 'ADMIN'; }
  isTattoer()  { return this.currentUser()?.role === 'TATTOER'; }

  private setSession(user: AuthResponse) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): AuthResponse | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}
