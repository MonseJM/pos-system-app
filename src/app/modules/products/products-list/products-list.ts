import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {

  products: any[] = [];

  // filtros
  search: string = '';
  filterActive: string = 'all'; // all | active | inactive
  filterSize: string = 'all';

  // modales
  showFormModal = false;
  showDetailsModal = false;

  // modo del modal
  modo: 'create' | 'edit' = 'create';

  // producto seleccionado
  selectedProduct: any = null;

  // model para formulario (CreateProductDto)
  form = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    size: '',
    color: '#ff2e63',
    imageUrl: ''
  };

  constructor(private service: ProductsService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.getAll().subscribe(res => {
      this.products = res;
      console.log(res);
    });
  }

  // ======= getters para filtros =======

  get sizesDisponibles(): string[] {
    const sizes = this.products
      .map(p => p.size)
      .filter((s: string) => s && s.trim() !== '');

    return Array.from(new Set(sizes)).sort((a, b) => a.localeCompare(b));
  }

  get filteredProducts(): any[] {
    let list = [...this.products];

    // ordenar alfabético
    list.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

    // buscar
    if (this.search.trim() !== '') {
      const q = this.search.toLowerCase();
      list = list.filter(p =>
        (p.name ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      );
    }

    // filtro active
    if (this.filterActive === 'active') {
      list = list.filter(p => p.isActive === true);
    }

    if (this.filterActive === 'inactive') {
      list = list.filter(p => p.isActive === false);
    }

    // filtro size
    if (this.filterSize !== 'all') {
      list = list.filter(p => (p.size ?? '').toLowerCase() === this.filterSize.toLowerCase());
    }

    return list;
  }

  // ======= modal create =======
  abrirCrear() {
    this.modo = 'create';
    this.resetForm();
    this.showFormModal = true;
  }

  // ======= modal edit =======
  editar(p: any) {
    this.modo = 'edit';

    // llenamos el formulario con el producto
    this.selectedProduct = p;
    this.form = {
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      size: p.size,
      color: p.color,
      imageUrl: p.imageUrl
    };

    this.showFormModal = true;
  }

  // ======= guardar =======
  guardar() {
    if (!this.form.name || this.form.name.trim() === '') {
      alert("El nombre es obligatorio 😭");
      return;
    }

    if (this.modo === 'create') {
      this.service.create(this.form).subscribe({
        next: () => {
          this.showFormModal = false;
          this.cargar();
        },
        error: () => alert("No se pudo crear el producto")
      });
    }

    if (this.modo === 'edit') {
      this.service.update(this.selectedProduct.id, this.form).subscribe({
        next: () => {
          this.showFormModal = false;
          this.selectedProduct = null;
          this.cargar();
        },
        error: () => alert("No se pudo editar el producto")
      });
    }
  }

  // ======= ver detalles =======
  ver(p: any) {
    this.selectedProduct = p;
    this.showDetailsModal = true;
  }

  cerrarDetalles() {
    this.selectedProduct = null;
    this.showDetailsModal = false;
  }

  cerrarForm() {
    this.selectedProduct = null;
    this.showFormModal = false;
  }

  resetForm() {
    this.form = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      size: '',
      color: '#ff2e63',
      imageUrl: ''
    };
  }

  // ======= desactivar (delete lógico) =======

desactivar(p: any) {
  if (!confirm(`¿Desactivar "${p.name}"?`)) return;

  this.service.delete(p.id).subscribe({
    next: () => {
      // 🔥 Actualiza el estado en el frontend (sin esperar reload)
      p.isActive = false;
      p.IsActive = false;

      alert("Producto desactivado con éxito");
      this.cargar();
    },
    error: () => alert("Producto desactivado con éxito")
    
  });
}

 

  limpiarFiltros() {
    this.search = '';
    this.filterActive = 'all';
    this.filterSize = 'all';
  }
}
