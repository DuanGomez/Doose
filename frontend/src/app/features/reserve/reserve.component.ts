import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CartItem, Appointment } from '../../core/models/models';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss']
})
export class ReservaComponent implements OnInit {
  items: CartItem[] = [];
  reservaId = '';
  fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  loading = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.reservaId = 'DSE-' + Math.floor(Math.random() * 90000 + 10000);
  }

  subtotal(item: CartItem) { return item.service.price * item.quantity; }
  get total() { return this.cartService.getTotal(); }

  confirmar() {
    if (this.loading) return;

    const stored: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');

    // Validar que ningún tatuador tenga ese slot ya confirmado
    const conflicto = this.items.find(item =>
      stored.some(a => a.tattoerId === item.tattoer.id && a.schedule === item.schedule)
    );
    if (conflicto) {
      this.toast.show(
        `${conflicto.tattoer.name} ya tiene una cita en ${conflicto.schedule}. Vuelve al carrito y elige otro horario.`,
        'error'
      );
      return;
    }

    this.loading = true;
    const user = this.auth.currentUser();

    this.items.forEach(item => {
      stored.push({
        id: 'APT-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        tattoerId: item.tattoer.id,
        tattoerName: item.tattoer.name,
        userId: user?.id ?? 0,
        userName: user?.name ?? 'Invitado',
        serviceName: item.service.name,
        serviceType: item.service.type,
        schedule: item.schedule,
        duration: item.service.duration,
        price: item.service.price * item.quantity
      });
    });

    localStorage.setItem('appointments', JSON.stringify(stored));
    this.cartService.clear();
    this.toast.show('¡Reserva confirmada! Nos contactaremos pronto.');
    this.loading = false;
    this.router.navigate(['/citas']);
  }
}
