import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './vistas/paginas/login/login.component';
import { PrincipalComponent } from './vistas/paginas/principal/principal.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: PrincipalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
