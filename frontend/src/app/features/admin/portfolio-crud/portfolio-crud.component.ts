import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioItem } from '../../../core/models/models';

@Component({
  selector: 'app-portfolio-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './portfolio-crud.component.html',
  styleUrls: ['./portfolio-crud.component.scss']
})
export class PortfolioCrudComponent implements OnInit {
  items: PortfolioItem[] = [];
  showModal = signal(false);
  editing = signal<PortfolioItem | null>(null);
  form: Partial<PortfolioItem> = {};
  previewUrl = '';

  constructor(private svc: PortfolioService) {}
  ngOnInit() { this.load(); }

  load() { this.svc.getAll().subscribe(d => this.items = d); }

  openNew() {
    this.form = { description: '', size: '', price: 0 };
    this.previewUrl = '';
    this.editing.set(null);
    this.showModal.set(true);
  }

  openEdit(item: PortfolioItem) {
    this.form = { ...item };
    this.previewUrl = item.imageBase64;
    this.editing.set(item);
    this.showModal.set(true);
  }

  onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      this.previewUrl = e.target!.result as string;
      this.form.imageBase64 = this.previewUrl;
    };
    reader.readAsDataURL(file);
  }

  save() {
    const item = this.editing();
    if (item) {
      this.svc.update(item.id!, this.form as PortfolioItem).subscribe(() => { this.load(); this.showModal.set(false); });
    } else {
      this.svc.create(this.form as PortfolioItem).subscribe(() => { this.load(); this.showModal.set(false); });
    }
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta imagen del portafolio?')) {
      this.svc.delete(id).subscribe(() => this.load());
    }
  }
}
