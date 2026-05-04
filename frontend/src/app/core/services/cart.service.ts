import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Appointment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  count = computed(() => this.items().reduce((acc, i) => acc + i.quantity, 0));

  getItems(): CartItem[] { return this.items(); }

  add(item: CartItem) {
    const current = this.items();
    const existing = current.find(
      i => i.service.id === item.service.id &&
           i.tattoer.id === item.tattoer.id &&
           i.schedule   === item.schedule
    );
    if (existing) {
      this.items.update(list =>
        list.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i)
      );
    } else {
      this.items.update(list => [...list, item]);
    }
  }

  updateQuantity(item: CartItem, qty: number) {
    this.items.update(list =>
      list.map(i => i === item ? { ...i, quantity: qty } : i)
    );
  }

  removeItem(item: CartItem) {
    this.items.update(list => list.filter(i => i !== item));
  }

  getTotal(): number {
    return this.items().reduce((acc, i) => acc + i.service.price * i.quantity, 0);
  }

  private storedAppointments(): Appointment[] {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  }

  // Horas ocupadas de un tatuador en un día (carrito + citas confirmadas)
  getOccupiedHours(tattoerId: number, day: string): string[] {
    const fromCart = this.items()
      .filter(i => i.tattoer.id === tattoerId && i.schedule.startsWith(day))
      .map(i => i.schedule.split(' ')[1]);
    const fromStored = this.storedAppointments()
      .filter(a => a.tattoerId === tattoerId && a.schedule.startsWith(day))
      .map(a => a.schedule.split(' ')[1]);
    return [...new Set([...fromCart, ...fromStored])];
  }

  // Cuántos servicios tiene un tatuador en un día
  getServiceCountByDay(tattoerId: number, day: string): number {
    return this.items()
      .filter(i => i.tattoer.id === tattoerId && i.schedule.startsWith(day))
      .length;
  }

  // Slot tomado si está en el carrito O en citas ya confirmadas
  isSlotTaken(tattoerId: number, day: string, hour: string): boolean {
    const schedule = `${day} ${hour}`;
    if (this.items().some(i => i.tattoer.id === tattoerId && i.schedule === schedule)) return true;
    return this.storedAppointments().some(a => a.tattoerId === tattoerId && a.schedule === schedule);
  }

  clear() { this.items.set([]); }
}
