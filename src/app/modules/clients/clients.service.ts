import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ClientService {

  private api = 'https://localhost:44320/api/customers';

  constructor(private http: HttpClient){}

  getClients(){
    return this.http.get<any[]>(this.api);
  }

  desactivarCliente(id: number){
  return this.http.put(`${this.api}/${id}`, {});
}
}