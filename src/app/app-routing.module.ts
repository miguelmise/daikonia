import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './vistas/paginas/login/login.component';
import { PrincipalComponent } from './vistas/paginas/principal/principal.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
