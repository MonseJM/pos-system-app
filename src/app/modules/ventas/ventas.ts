import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from './ventas.service';


@Component({
  selector: 'app-ventas',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss',
})
export class Ventas {
  invoices: any[] = [];
  search = '';
  filterStatus = 'all';

constructor(private invoiceService: InvoiceService){}

ngOnInit(){
  this.invoiceService.getInvoices()
    .subscribe(res => this.invoices = res);
}

  
    get filteredInvoices(){

      let lista = [...this.invoices];

      // 🔎 buscar
      if(this.search.trim()){
        const t = this.search.toLowerCase();
        lista = lista.filter(i =>
          i.id.toString().includes(t) ||
          (i.status || '').toLowerCase().includes(t)
        );
      }

      // 📊 filtro status
      if(this.filterStatus !== 'all'){
        lista = lista.filter(i => i.status === this.filterStatus);
      }

      return lista;
    }

    limpiarFiltros(){
      this.search = '';
      this.filterStatus = 'all';
    }




    showDetailsModal = false;
    selectedInvoice: any = null;

    ver(i: any){
      this.selectedInvoice = i;
      this.showDetailsModal = true;
    }

    cerrarDetalles(){
      this.showDetailsModal = false;
      this.selectedInvoice = null;
    }





}
