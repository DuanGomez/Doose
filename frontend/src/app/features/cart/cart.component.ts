import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item);
    this.items = this.cartService.getItems();
  }

  get total(): number {
    return this.cartService.getTotal();
  }
}
