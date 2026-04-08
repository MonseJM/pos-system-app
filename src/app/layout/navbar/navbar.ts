import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../Clientes/car/car.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {

  menuOpen = false;
  cartCount = 0;

  constructor(private cart: CartService) {}

  ngOnInit() {
    this.cart.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
  }

}
