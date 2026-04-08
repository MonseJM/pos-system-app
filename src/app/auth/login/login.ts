import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Auth } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../layout/navbar/navbar';
  import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule, Navbar],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  datos: any = { fullName: '',email: '', password: '' };


  constructor(private auth: Auth, private router: Router) {}

  entrar() {
    this.auth.login(this.datos)
      .subscribe((res: any) => {
        console.log(res);
        
        this.auth.guardarSesion(res.token);

        const role = this.auth.getRole();

        if (role?.toLowerCase() === 'admin') {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/home']);
        }
        console.log("ROLE:", role);
      }, error => {
        alert("Error al iniciar sesión");
      });
  }

  mostrarRegistro = false;

abrirRegistro() {
  this.mostrarRegistro = true;
}

cerrarRegistro() {
  this.mostrarRegistro = false;
}

registrar() {
  this.auth.register(this.datos)
    .subscribe((res: any) => {

      this.auth.guardarSesion(res.token);

      const role = this.auth.getRole();

      this.mostrarRegistro = false;

      if (role?.toLowerCase() === 'admin') {
        this.router.navigate(['/admin/home']);
      } else {
        this.router.navigate(['/home']);
      }

    }, err => {
      alert("Error al registrar");
    });
}
}