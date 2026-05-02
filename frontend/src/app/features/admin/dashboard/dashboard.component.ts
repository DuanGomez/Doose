import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { UserService } from '../../../core/services/user.service';
import { TattooServiceService } from '../../../core/services/tattoo.service';
import { PortfolioItem } from '../../../core/models/models';
import { ApiResponse } from '../../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalPortfolio = 0;
  totalUsers = 0;
  totalServices = 0;
  totalMessages = 0;
  topItem: PortfolioItem | null = null;

  constructor(
    private portfolioSvc: PortfolioService,
    private userSvc: UserService,
    private tattooSvc: TattooServiceService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.portfolioSvc.getAll().subscribe(d => this.totalPortfolio = d.length);
    this.userSvc.getAll().subscribe(d => this.totalUsers = d.length);
    this.tattooSvc.getAll().subscribe(d => this.totalServices = d.length);
    this.portfolioSvc.topOfWeek().subscribe(d => this.topItem = d);
    this.http.get<ApiResponse<any[]>>('http://localhost:8080/api/contact')
      .pipe(map(r => r.data.length))
      .subscribe(n => this.totalMessages = n);
  }
}
