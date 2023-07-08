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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import { ProductosComponent } from './vistas/paginas/productos/productos.component';
import { InventarioComponent } from './vistas/paginas/inventario/inventario.component';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { ReglasComponent } from './vistas/paginas/reglas/reglas.component';
import { PlanificadorComponent } from './vistas/paginas/planificador/planificador.component';
import { FormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';

import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoriasComponent } from './vistas/paginas/categorias/categorias.component';


@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    LoginComponent,
    InicioComponent,
    UsuariosComponent,
    DonantesComponent,
    BeneficiadosComponent,
    ProductosComponent,
    InventarioComponent,
    ReglasComponent,
    PlanificadorComponent,
    CategoriasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    FormsModule,
    MatExpansionModule,
    MatDialogModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatSortModule
  ],
  exports: [
    HttpClientModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }