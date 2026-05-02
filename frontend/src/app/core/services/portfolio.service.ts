import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse, PortfolioItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly API = 'http://localhost:8080/api/portfolio';

  constructor(private http: HttpClient) {}

  getAll()        { return this.http.get<ApiResponse<PortfolioItem[]>>(this.API).pipe(map(r => r.data)); }
  create(item: PortfolioItem) { return this.http.post<ApiResponse<PortfolioItem>>(this.API, item).pipe(map(r => r.data)); }
  update(id: number, item: PortfolioItem) { return this.http.put<ApiResponse<PortfolioItem>>(`${this.API}/${id}`, item).pipe(map(r => r.data)); }
  delete(id: number) { return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`); }
  topOfWeek()     { return this.http.get<ApiResponse<PortfolioItem>>(`${this.API}/stat/top-week`).pipe(map(r => r.data)); }
}
