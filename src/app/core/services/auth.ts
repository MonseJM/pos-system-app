import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  api = "https://localhost:44320/api/users";

  constructor(private http: HttpClient) {}

  login(datos: any) {
    return this.http.post(`${this.api}/login`, datos);
  }

  // ✅ Guardar token
  guardarSesion(token: string) {
    localStorage.setItem('token', token);
  }

  // ✅ Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Obtener rol desde el JWT
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    // ⚠️ esto depende de cómo venga el claim del backend
    return payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  // ✅ Logout
  logout() {
    localStorage.removeItem('token');
  }

  // ✅ Verificar si está logueado
  estaLogueado(): boolean {
    return !!this.getToken();
  }

  register(datos: any) {
      return this.http.post(this.api, datos);
  }
}