import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { PortfolioItem } from '../../core/models/models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  items: PortfolioItem[] = [];
  favoriteIds = new Set<number>();
  selected = signal<PortfolioItem | null>(null);
  toast = signal<string>('');

  constructor(
    private portfolioSvc: PortfolioService,
    private favSvc: FavoriteService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.portfolioSvc.getAll().subscribe(data => this.items = data);
    if (this.auth.isLoggedIn()) {
      this.favSvc.getMyFavorites().subscribe(favs => {
        this.favoriteIds = new Set(favs.map(f => f.id!));
      });
    }
  }

  toggleFavorite(item: PortfolioItem) {
    if (!this.auth.isLoggedIn()) { this.showToast('Inicia sesión para guardar favoritos'); return; }
    const id = item.id!;
    if (this.favoriteIds.has(id)) {
      this.favSvc.remove(id).subscribe(() => {
        this.favoriteIds.delete(id);
        item.favoritesCount = Math.max(0, (item.favoritesCount ?? 1) - 1);
      });
    } else {
      this.favSvc.add(id).subscribe(() => {
        this.favoriteIds.add(id);
        item.favoritesCount = (item.favoritesCount ?? 0) + 1;
        this.showToast('Agregado a favoritos ♥');
      });
    }
  }

  isFav(id: number) { return this.favoriteIds.has(id); }
  open(item: PortfolioItem) { this.selected.set(item); }
  close() { this.selected.set(null); }

  private showToast(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(''), 3000);
  }
}
