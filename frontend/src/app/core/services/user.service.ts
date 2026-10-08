import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<ApiResponse<User[]>>(this.API).pipe(map(r => r.data)); }
  getTattoers() { return this.http.get<ApiResponse<User[]>>(`${this.API}/tattoers`).pipe(map(r => r.data)); }
  updateProfile(specialty: string, experience: number) {
    return this.http.put<ApiResponse<void>>(`${environment.apiUrl}/users/profile`, { specialty, experience });
  }
}
