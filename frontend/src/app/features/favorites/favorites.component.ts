import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../core/services/favorite.service';
import { PortfolioItem } from '../../core/models/models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: PortfolioItem[] = [];

  constructor(private favSvc: FavoriteService) {}

  ngOnInit() { this.favSvc.getMyFavorites().subscribe(data => this.favorites = data); }

  remove(item: PortfolioItem) {
    this.favSvc.remove(item.id!).subscribe(() => {
      this.favorites = this.favorites.filter(f => f.id !== item.id);
    });
  }
}
