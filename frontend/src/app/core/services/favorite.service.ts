import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse, PortfolioItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly API = 'http://localhost:8080/api/favorites';

  constructor(private http: HttpClient) {}

  getMyFavorites()       { return this.http.get<ApiResponse<PortfolioItem[]>>(this.API).pipe(map(r => r.data)); }
  add(portfolioId: number)    { return this.http.post<ApiResponse<void>>(`${this.API}/${portfolioId}`, {}); }
  remove(portfolioId: number) { return this.http.delete<ApiResponse<void>>(`${this.API}/${portfolioId}`); }
}
