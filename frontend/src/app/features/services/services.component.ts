import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TattooServiceService } from '../../core/services/tattoo.service';
import { UserService } from '../../core/services/user.service';
import { CartService } from '../../core/services/cart.service';
import { TattooService, TattooServiceExtended, Tattoer, User } from '../../core/models/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: TattooService[] = [];
  catalog: TattooServiceExtended[] = [];
  tattoers: Tattoer[] = [];

  showModal = signal(false);
  showAuthPrompt = signal(false);
  selectedService: TattooServiceExtended | null = null;
  selectedTattoer!: Tattoer;
  selectedDay  = 'Lunes';
  selectedHour = '08:00';
  quantity = 1;
  toast        = signal('');
  toastType    = signal('success');
  errorMsg     = signal('');

  days  = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  allHours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

  constructor(private svc: TattooServiceService, private userSvc: UserService, public cartService: CartService, public auth: AuthService) {}

  ngOnInit() {
    this.svc.getAll().subscribe(data => {
      this.services = data;
      this.catalog = data.map(s => ({
        id: s.id!,
        name: s.name,
        description: s.description,
        imageBase64: s.imageBase64,
        price: s.price!,
        duration: s.duration!,
        type: s.type!
      }));
    });
    this.userSvc.getTattoers().subscribe((data: User[]) => {
      this.tattoers = data
        .filter(u => u.role === 'TATTOER')
        .map(u => ({ id: u.id, name: u.name, specialty: u.specialty, experience: u.experience }));
      this.selectedTattoer = this.tattoers[0];
    });
  }

  get filteredTattoers(): Tattoer[] {
    if (!this.selectedService) return this.tattoers;
    return this.tattoers.filter(t => t.specialty === this.selectedService!.type);
  }

  get availableHours(): string[] {
    if (!this.selectedService) return this.allHours;

    const duracion = this.selectedService.duration;
    const cierreMinutos = 18 * 60;

    return this.allHours.filter(hour => {
      const [h, m] = hour.split(':').map(Number);
      const inicioMinutos = h * 60 + m;

      if (inicioMinutos + duracion > cierreMinutos) return false;
      if (this.cartService.isSlotTaken(this.selectedTattoer.id, this.selectedDay, hour)) return false;

      return true;
    });
  }

  get tattoerFullDay(): boolean {
    return this.cartService.getServiceCountByDay(this.selectedTattoer.id, this.selectedDay) >= 3;
  }

  openModal(service: TattooServiceExtended) {
    if (!this.auth.isLoggedIn()) {
      this.showAuthPrompt.set(true);
      return;
    }
    this.selectedService = service;
    this.selectedDay     = 'Lunes';
    this.selectedHour    = '08:00';
    this.quantity        = 1;
    this.errorMsg.set('');
    const available = this.tattoers.filter(t => t.specialty === service.type);
    this.selectedTattoer = available[0] ?? this.tattoers[0];
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.errorMsg.set('');
  }

  onTattoerChange() {
    this.errorMsg.set('');
    if (!this.availableHours.includes(this.selectedHour)) {
      this.selectedHour = this.availableHours[0] ?? '';
    }
  }

  onDayChange() {
    this.errorMsg.set('');
    if (!this.availableHours.includes(this.selectedHour)) {
      this.selectedHour = this.availableHours[0] ?? '';
    }
  }

  addToCart() {
    if (!this.selectedService) return;

    if (this.tattoerFullDay) {
      this.errorMsg.set(`${this.selectedTattoer.name} ya tiene 3 servicios el ${this.selectedDay}. Elige otro día o tatuador.`);
      return;
    }

    if (this.availableHours.length === 0) {
      this.errorMsg.set('No hay horarios disponibles para esta selección.');
      return;
    }

    if (!this.availableHours.includes(this.selectedHour)) {
      this.errorMsg.set('El horario seleccionado no está disponible. Elige otro.');
      return;
    }

    this.cartService.add({
      service:  this.selectedService,
      tattoer:  this.selectedTattoer,
      schedule: `${this.selectedDay} ${this.selectedHour}`,
      quantity: 1
    });

    this.closeModal();
    this.toast.set('¡Agregado al carrito!');
    setTimeout(() => this.toast.set(''), 2500);
  }
}