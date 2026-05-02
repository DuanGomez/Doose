import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly API = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) {}

  send(body: { name: string; email: string; phone?: string; message: string }) {
    return this.http.post<ApiResponse<void>>(this.API, body);
  }
}
