import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 import { Navbar } from '../../../layout/navbar/navbar';
import { ProductsService } from '../../../modules/products/products-list/products.service';
import { CartService } from '../../car/car.service';


@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
 products: any[] = [];

  searchText: string = '';
  filterSize: string = '';
  filterColor: string = '';
  onlyActive: boolean = true;
  orderBy: string = 'az';

  sizes: string[] = [];
  colors: string[] = [];

  constructor(private service: ProductsService,
    private cart: CartService

  ) {}
  ngOnInit(){
    this.cargar();
  }

  cargar(){
    this.service.getAll().subscribe(res => {
      this.products = res;

      // sacar sizes y colors únicos
      this.sizes = [...new Set(this.products.map(p => p.size).filter(Boolean))];
      this.colors = [...new Set(this.products.map(p => p.color).filter(Boolean))];
    });
  }

  productosFiltrados(){
    let lista = [...this.products];

    // filtro activos
    if(this.onlyActive){
      lista = lista.filter(p => p.isActive === true);
    }

    // buscar por nombre
    if(this.searchText.trim() !== ''){
      const t = this.searchText.toLowerCase();
      lista = lista.filter(p => (p.name || '').toLowerCase().includes(t));
    }

    // filtro size
    if(this.filterSize){
      lista = lista.filter(p => p.size === this.filterSize);
    }

    // filtro color
    if(this.filterColor){
      lista = lista.filter(p => p.color === this.filterColor);
    }

    // ordenar
    if(this.orderBy === 'az'){
      lista.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
    }

    if(this.orderBy === 'za'){
      lista.sort((a,b) => (b.name || '').localeCompare(a.name || ''));
    }

    if(this.orderBy === 'priceLow'){
      lista.sort((a,b) => (a.price || 0) - (b.price || 0));
    }

    if(this.orderBy === 'priceHigh'){
      lista.sort((a,b) => (b.price || 0) - (a.price || 0));
    }

    return lista;
  }

  agregarCarrito(p: any){
  this.cart.add(p);
  alert(`🛒 Agregado al carrito: ${p.name}`);
  }

  verDetalle(p: any){
    alert(`📌 ${p.name}\n\n${p.description}`);
  }
}
