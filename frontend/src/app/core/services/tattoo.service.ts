import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse, TattooService } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TattooServiceService {
  private readonly API = 'http://localhost:8080/api/services';

  constructor(private http: HttpClient) {}

  getAll()        { return this.http.get<ApiResponse<TattooService[]>>(this.API).pipe(map(r => r.data)); }
  create(s: TattooService) { return this.http.post<ApiResponse<TattooService>>(this.API, s).pipe(map(r => r.data)); }
  update(id: number, s: TattooService) { return this.http.put<ApiResponse<TattooService>>(`${this.API}/${id}`, s).pipe(map(r => r.data)); }
  delete(id: number) { return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`); }
}
