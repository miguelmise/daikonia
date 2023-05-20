import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './vistas/paginas/principal/principal.component';
import { LoginComponent } from './vistas/paginas/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InicioComponent } from './vistas/paginas/inicio/inicio.component';
import { UsuariosComponent } from './vistas/sistema/usuarios/usuarios.component';
import { DonantesComponent } from './vistas/paginas/donantes/donantes.component';
import { BeneficiadosComponent } from './vistas/paginas/beneficiados/beneficiados.component';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    LoginComponent,
    InicioComponent,
    UsuariosComponent,
    DonantesComponent,
    BeneficiadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
