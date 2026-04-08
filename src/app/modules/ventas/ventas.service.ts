import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private api = 'https://localhost:44320/api/invoices';

  constructor(private http: HttpClient) {}

  getInvoices(){
    return this.http.get<any[]>(this.api);
  }

  getById(id: number){
    return this.http.get<any>(`${this.api}/${id}`);
  }

  descargarXML(id: number){
    window.open(`${this.api}/${id}/xml`);
  }

  descargarPDF(id: number){
    window.open(`${this.api}/${id}/pdf`);
  }

}