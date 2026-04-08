import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Login } from './auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { Home } from './Clientes/Home_Clientes/home/home';
import { Car } from './Clientes/car/car';
import { CompraExito } from './Clientes/compra-exito/compra-exito';

export const routes: Routes = [

 { path:'login',component:Login },

 { path:'home',component:Home },

 { path:'carrito',component:Car },

 {path:'compra-exitosa/:id',component:CompraExito},

 {
   path:'admin',
   component:AdminLayout,
   canActivate:[authGuard],
   children:[
     {
       path:'products',
       loadChildren:()=>import('./modules/products/products-list/products.routes')
       .then(m=>m.productsRoutes)
     },
     {
       path:'home',
       loadChildren:()=>import('./modules/home_admin/home/home.routes')
       .then(m=>m.homeRoutes)
     },
     {
      path:'clients',
      loadChildren:()=>import('./modules/clients/clients.routes')
      .then(m=>m.productsRoutes)
     },
     {
      path:'ventas',
      loadChildren:()=>import('./modules/ventas/ventas.routes')
      .then(m=>m.productsRoutes)
     },
      {
        path:'analisis',
        loadChildren:()=>import('./modules/analisis/analisis.routes')
        .then(m=>m.productsRoutes)
      }

   ]
 },

 { path:'',redirectTo:'login',pathMatch:'full'}

];