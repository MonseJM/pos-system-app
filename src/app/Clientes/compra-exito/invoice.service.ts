import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../modules/products/products-list/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
    constructor(private http: HttpClient) {}

    
createFromSale(saleId: number){
  return this.http.post(
    `https://localhost:44320/api/invoices/from-sale/${saleId}`,
    {}
  );
}

getMyCustomer(){
  return this.http.get<any>('https://localhost:44320/api/customers/mine',
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

updateCustomer(customer: any){
  return this.http.put(
    `https://localhost:44320/api/customers/${customer.id}`,
    customer
  );
}

descargarXML(id: number){
  const link = document.createElement('a');
  link.href = `https://localhost:44320/api/invoices/${id}/xml`;
  link.download = `factura_${id}.xml`;
  link.click();
}

descargarPDF(id: number){
  const link = document.createElement('a');
  link.href = `https://localhost:44320/api/invoices/${id}/pdf`;
  link.download = `factura_${id}.pdf`;
  link.click();
}
}