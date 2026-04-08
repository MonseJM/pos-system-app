import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({providedIn:'root'})
export class ProductsService{

 api="https://localhost:44320/api/products";

 constructor(private http:HttpClient){}

 getAll(){
   return this.http.get<Product[]>(this.api);
 }

 create(dto: any){
  return this.http.post(this.api, dto);
}

update(id: number, dto: any){
  return this.http.put(`https://localhost:44320/api/products/${id}`, dto);
}


delete(id: number){
  return this.http.delete(`https://localhost:44320/api/products/${id}`);
}
}
