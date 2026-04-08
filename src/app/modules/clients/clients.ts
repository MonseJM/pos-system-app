import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from './clients.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-clients',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients {

  clientes: any[] = [];
search = '';
filterActive = 'all';
orderBy = 'az';

constructor(private clientsService: ClientService){}

ngOnInit(){
  this.clientsService.getClients()
    .subscribe(res => this.clientes = res);
}

get filteredClientes() {

  let lista = [...this.clientes];

  // 🔎 buscar
  if (this.search.trim()) {
    const t = this.search.toLowerCase();
    lista = lista.filter(c =>
      (c.Name || '').toLowerCase().includes(t) ||
      (c.email || '').toLowerCase().includes(t)
    );
  }

  // ✅ activos
  if (this.filterActive === 'active') {
    lista = lista.filter(c => c.isActive);
  }

  if (this.filterActive === 'inactive') {
    lista = lista.filter(c => !c.isActive);
  }

  // 🔤 ordenar
  if (this.orderBy === 'az') {
    lista.sort((a,b) =>
      (a.Name || '').localeCompare(b.Name || '')
    );
  }

  if (this.orderBy === 'za') {
    lista.sort((a,b) =>
      (b.Name || '').localeCompare(a.Name || '')
    );
  }

  return lista;
}

limpiarFiltros(){
  this.search = '';
  this.filterActive = 'all';
  this.orderBy = 'az';
}

desactivar(c: any){
  if(!confirm(`¿Desactivar a ${c.name}?`)) return;

  this.clientsService.desactivarCliente(c.id)
    .subscribe(() => {
      c.isActive = false; // refresco rápido UI
    });
}

showDetailsModal = false;
selectedCliente: any = null;

ver(c: any){
  this.selectedCliente = c;
  this.showDetailsModal = true;
}

cerrarDetalles(){
  this.showDetailsModal = false;
  this.selectedCliente = null;

}


}
