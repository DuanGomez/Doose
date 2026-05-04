import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TattooServiceService } from '../../../core/services/tattoo.service';
import { TattooService } from '../../../core/models/models';

@Component({
  selector: 'app-services-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './services-crud.component.html',
  styleUrls: ['./services-crud.component.scss']
})
export class ServicesCrudComponent implements OnInit {
  services: TattooService[] = [];
  showModal = signal(false);
  editing = signal<TattooService | null>(null);
  form: Partial<TattooService> = {};
  previewUrl = '';

  constructor(private svc: TattooServiceService) {}
  ngOnInit() { this.load(); }

  load() { this.svc.getAll().subscribe(d => this.services = d); }

  openNew() {
    this.form = { name: '', description: '', duration: undefined, type: '' };
    this.previewUrl = '';
    this.editing.set(null);
    this.showModal.set(true);
  }

  openEdit(s: TattooService) {
    this.form = { ...s };
    this.previewUrl = s.imageBase64 || '';
    this.editing.set(s);
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
    const s = this.editing();
    if (s) {
      this.svc.update(s.id!, this.form as TattooService).subscribe(() => { this.load(); this.showModal.set(false); });
    } else {
      this.svc.create(this.form as TattooService).subscribe(() => { this.load(); this.showModal.set(false); });
    }
  }

  delete(id: number) {
    if (confirm('¿Eliminar este servicio?')) {
      this.svc.delete(id).subscribe(() => this.load());
    }
  }
}
