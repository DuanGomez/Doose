import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { TattooServiceService } from '../../core/services/tattoo.service';
import { PortfolioItem, TattooService } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  portfolio: PortfolioItem[] = [];
  services: TattooService[] = [];

  constructor(
    private portfolioSvc: PortfolioService,
    private tattooSvc: TattooServiceService
  ) {}

  ngOnInit() {
    this.portfolioSvc.getAll().subscribe(data => this.portfolio = data.slice(0, 6));
    this.tattooSvc.getAll().subscribe(data => this.services = data.slice(0, 3));
  }
}
