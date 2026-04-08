import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../modules/products/products-list/product.model';
import { HttpClient } from '@angular/common/http';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadFromStorage() {
    const data = localStorage.getItem('cart');
    if (data) {
      this.cartItems = JSON.parse(data);
    }
    this.updateCount();
  }

  private updateCount() {
    const total = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    this.cartCountSubject.next(total);
  }

  getItems() {
    return this.cartItems;
  }

  add(product: Product) {
    const existing = this.cartItems.find(x => x.product.id === product.id);

    if (existing) existing.quantity++;
    else this.cartItems.push({ product, quantity: 1 });

    this.saveToStorage();
    this.updateCount();
  }

  remove(productId: number) {
    this.cartItems = this.cartItems.filter(x => x.product.id !== productId);
    this.saveToStorage();
    this.updateCount();
  }

  clear() {
    this.cartItems = [];
    this.saveToStorage();
    this.updateCount();
  }

  checkout(data: any) {
  const token = localStorage.getItem('token');

  return this.http.post(
    'https://localhost:44320/api/sales',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}

