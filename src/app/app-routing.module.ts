import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './vistas/paginas/inicio/inicio.component';
import { LoginComponent } from './vistas/paginas/login/login.component';
import { PrincipalComponent } from './vistas/paginas/principal/principal.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'usuarios', component: InicioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
