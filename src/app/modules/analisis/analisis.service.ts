import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private api = 'https://localhost:44320/api/analytics';

  constructor(private http: HttpClient) {}

  getDaily(){
    return this.http.get<any[]>(`${this.api}/daily`);
  }

  getSummary(){
    return this.http.get<any>(`${this.api}/summary`);
  }
}