import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, Appointment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  // El carrito se guarda en localStorage para no perderlo al recargar la página.
  private items = signal<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  private persist = effect(() => localStorage.setItem('cart', JSON.stringify(this.items())));

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

  private toMinutes(hour: string): number {
    const [h, m] = hour.split(':').map(Number);
    return h * 60 + m;
  }

  /** Bloques ocupados [inicio, fin) de un tatuador en un día: carrito + citas confirmadas. */
  private busyBlocks(tattoerId: number, day: string): [number, number][] {
    const fromCart = this.items()
      .filter(i => i.tattoer.id === tattoerId && i.schedule.startsWith(day + ' '))
      .map(i => [i.schedule.split(' ')[1], i.service.duration] as const);
    const fromStored = this.storedAppointments()
      .filter(a => a.tattoerId === tattoerId && a.schedule.startsWith(day + ' '))
      .map(a => [a.schedule.split(' ')[1], a.duration] as const);
    return [...fromCart, ...fromStored].map(([hour, dur]) => {
      const start = this.toMinutes(hour);
      return [start, start + dur] as [number, number];
    });
  }

  // Cuántos servicios tiene un tatuador en un día (carrito + citas confirmadas)
  getServiceCountByDay(tattoerId: number, day: string): number {
    return this.busyBlocks(tattoerId, day).length;
  }

  // El horario choca si se cruza con otro servicio del tatuador, teniendo en cuenta la duración
  isSlotTaken(tattoerId: number, day: string, hour: string, duration = 60): boolean {
    const start = this.toMinutes(hour);
    const end = start + duration;
    return this.busyBlocks(tattoerId, day).some(([s, e]) => start < e && s < end);
  }

  clear() { this.items.set([]); }
}
