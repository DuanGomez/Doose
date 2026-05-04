import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse, Tattoer } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TattoerService {
  private readonly API = 'http://localhost:8080/api/tattoers';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<ApiResponse<Tattoer[]>>(this.API).pipe(map(r => r.data)); }
}