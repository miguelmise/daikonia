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
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoriasComponent } from './vistas/paginas/categorias/categorias.component';
import { CategoriaProductoComponent } from './vistas/paginas/categorias/categoria-producto/categoria-producto.component';
import { OrdenesComponent } from './vistas/paginas/ordenes/ordenes.component';
import { NoAutorizadoComponent } from './vistas/sistema/no-autorizado/no-autorizado.component';
import { NgChartjsModule } from 'ng-chartjs';
import { DonantesReporteComponent } from './vistas/reportes/donantes-reporte/donantes-reporte.component';
import { OrdenesReporteComponent } from './vistas/reportes/ordenes-reporte/ordenes-reporte.component';
import { BeneficiadosReporteComponent } from './vistas/reportes/beneficiados-reporte/beneficiados-reporte.component';
import { RepartidorComponent } from './vistas/paginas/repartidor/repartidor.component';


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
    CategoriasComponent,
    CategoriaProductoComponent,
    OrdenesComponent,
    NoAutorizadoComponent,
    DonantesReporteComponent,
    OrdenesReporteComponent,
    BeneficiadosReporteComponent,
    RepartidorComponent
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
    MatSortModule,
    MatStepperModule,
    NgChartjsModule,
    MatProgressBarModule
  ],
  exports: [
    HttpClientModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatSortModule,
    MatStepperModule,
    NgChartjsModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }