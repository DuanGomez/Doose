import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
  }

  updateQty(item: CartItem, qty: number) {
    if (qty < 1) return;
    this.cartService.updateQuantity(item, qty);
    this.items = this.cartService.getItems();
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item);
    this.items = this.cartService.getItems();
  }

  subtotal(item: CartItem): number {
    return item.service.price * item.quantity;
  }

  get total(): number {
    return this.cartService.getTotal();
  }
}