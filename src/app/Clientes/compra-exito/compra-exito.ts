import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../layout/navbar/navbar';
import { RouterModule } from '@angular/router';
import { InvoiceService } from './invoice.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-compra-exito',
  imports: [CommonModule, Navbar, RouterModule, FormsModule],
  templateUrl: './compra-exito.html',
  styleUrl: './compra-exito.scss',
})
export class CompraExito {

  mostrarModal = false;
  saleId!: number;

  customer: any = {
    id: 0,
    name: '',
    rfc: '',
    fiscalRegime: '',
    cfdiUse: '',
    postalCode: '',
    email: ''
  };

  
  

  fecha = new Date().toLocaleDateString();

  constructor(private route: ActivatedRoute
    , private invoiceService: InvoiceService
  ) {
    this.route.queryParams.subscribe(params => {
      this.saleId = params['saleId'] || null;
    });
  }


abrirModalFacturacion(){

  this.mostrarModal = true;

  this.invoiceService.getMyCustomer()
    .subscribe({
      next: (res) => this.customer = res,
      error: () => {
        // si no tiene datos fiscales aún
        console.log("No tiene datos fiscales registrados");
      }
    });

}


cerrarModal(){
  this.mostrarModal = false;
}
guardarYFacturar(){

  if(!this.validarRFC(this.customer.rfc)){
    alert("RFC inválido ❌");
    return;
  }

  if(!this.customer.name || !this.customer.email){
    alert("Completa todos los datos fiscales");
    return;
  }

  this.invoiceService.updateCustomer(this.customer)
    .subscribe({
      next: () => {

        this.invoiceService
          .createFromSale(this.saleId)
          .subscribe({
            next: (res: any) => {

              // 🔥 ESTA LÍNEA ES LA MAGIA
              this.invoiceId = res.id;
              console.log("RESPUESTA COMPLETA:", res);
              localStorage.setItem('invoiceId', this.invoiceId.toString());
              alert("Factura generada 🎉");
              this.mostrarModal = false;

              console.log("InvoiceId:", this.invoiceId);

            }
          });

      }
    });
}

validarRFC(rfc: string): boolean {

  const rfcRegex = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})$/;

  return rfcRegex.test(rfc.toUpperCase());
}

ngOnInit() {

  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.saleId = Number(id);
  }

  // 🔥 RECUPERAR FACTURA
  const savedInvoice = localStorage.getItem('invoiceId');

  if(savedInvoice){
    this.invoiceId = Number(savedInvoice);
    console.log("Invoice recuperado:", this.invoiceId);
  }

}

invoiceId!: number;
/*
descargarXML(id: number){
  const link = document.createElement('a');
  link.href = `https://localhost:44320/api/invoices/${id}/xml`;
  link.download = `factura_${id}.xml`;
  link.click();
}

descargarPDF(){
  if(!this.invoiceId){
    alert("Primero genera la factura");
    return;
  }

  this.invoiceService.descargarPDF(this.invoiceId);
}
*/
descargarTodo(){
  if(!this.invoiceId){
    alert("Primero genera la factura");
    return;
  }

  this.invoiceService.descargarXML(this.invoiceId);

  // ⏳ pequeño delay para evitar conflicto de descargas
  setTimeout(() => {
    this.invoiceService.descargarPDF(this.invoiceId);
  }, 800);
}
}
