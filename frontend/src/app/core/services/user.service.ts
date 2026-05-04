import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<ApiResponse<User[]>>(this.API).pipe(map(r => r.data)); }
  getTattoers() { return this.http.get<ApiResponse<User[]>>(`${this.API}/tattoers`).pipe(map(r => r.data)); }
}
