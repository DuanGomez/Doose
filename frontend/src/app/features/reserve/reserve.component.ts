import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
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
  fecha = new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });

  constructor(private cartService: CartService, private auth: AuthService) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.reservaId = 'DSE-' + Math.floor(Math.random() * 90000 + 10000);
  }

  subtotal(item: CartItem) { return item.service.price * item.quantity; }
  get total() { return this.cartService.getTotal(); }

  confirmar() {
    const user = this.auth.currentUser();
    const stored: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
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
    alert('¡Reserva confirmada! Nos contactaremos pronto.');
  }
}