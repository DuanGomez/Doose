import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/models';

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

  // Horas ocupadas de un tatuador en un día específico
  getOccupiedHours(tattoerId: number, day: string): string[] {
    return this.items()
      .filter(i => i.tattoer.id === tattoerId && i.schedule.startsWith(day))
      .map(i => i.schedule.split(' ')[1]);
  }

  // Cuántos servicios tiene un tatuador en un día
  getServiceCountByDay(tattoerId: number, day: string): number {
    return this.items()
      .filter(i => i.tattoer.id === tattoerId && i.schedule.startsWith(day))
      .length;
  }

  // Verificar si un slot está tomado
  isSlotTaken(tattoerId: number, day: string, hour: string): boolean {
    return this.items().some(
      i => i.tattoer.id === tattoerId && i.schedule === `${day} ${hour}`
    );
  }

  clear() { this.items.set([]); }
}