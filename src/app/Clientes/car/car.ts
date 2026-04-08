import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService,CartItem } from '../../Clientes/car/car.service';
 import { Navbar } from '../../layout/navbar/navbar';
import {Router } from '@angular/router';

@Component({
  selector: 'app-car',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './car.html',
  styleUrl: './car.scss',
})
export class Car {

  items: CartItem[] = [];

  constructor(private cart: CartService, private router: Router) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.items = this.cart.getItems();
  }

  aumentar(item: CartItem) {
    this.cart.add(item.product);
    this.cargar();
  }

  disminuir(item: CartItem) {
    // si baja a 0 lo quitamos
    if (item.quantity <= 1) {
      this.cart.remove(item.product.id);
    } else {
      item.quantity--;
    }

    // guardar cambios manualmente
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.cargar();
  }

  quitar(item: CartItem) {
    this.cart.remove(item.product.id);
    this.cargar();
  }

  vaciar() {
    if (!confirm("¿Vaciar carrito?")) return;
    this.cart.clear();
    this.cargar();
  }

  get subtotal() {
    return this.items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  }

  get total() {
    return this.subtotal; // aquí luego metes envío o descuento
  }

  comprar() {

  const customerId = Number(localStorage.getItem('customerId'));

const venta = {
  items: this.items.map(i => ({
    productId: i.product.id,
    quantity: i.quantity
  }))
};

  this.cart.checkout(venta).subscribe({
next: (res: any) => {

  console.log("Respuesta:", res);

  this.router.navigate(['/compra-exitosa', res.id])
    .then(ok => console.log("¿Navegó?", ok))
    .catch(err => console.error("Error navegación:", err));



      console.log(res);
    },
    error: (err) => {
      console.error(err);
      alert("Error al procesar la compra");
    }
  });

  
}
}


