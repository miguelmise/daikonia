import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import { PlanificadorService } from 'src/app/servicios/planificador.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements OnInit {

  listaOrdenes: any[] = [];

  ordenAlimentos: any[] = [];

  displayedColumns: string[] = ['orden_beneficiado_nombre', 'orden_producto_ubicacion','orden_producto_caducidad','orden_producto_codigo','orden_producto_descripcion',
                                  'orden_proveedor_nombre','orden_producto_precio','orden_producto_cantidad','orden_fecha_emision','orden_boton_devolver'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _util : UtilService, private _planificador : PlanificadorService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarListaOrdenes();
  }


  cargarOrden(id:any):void{
    this._planificador.obtener_orden(id).subscribe({
      next:res=>{
        this.ordenAlimentos = res
        this.dataSource = new MatTableDataSource(this.ordenAlimentos);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },error:err=>{
        if(err.error){
          this._util.alerta_error(err.error)
        }else{
          this._util.alerta_error(JSON.stringify(err))
        }
      }
    })
  }

  cargarListaOrdenes():void{
    this._planificador.listar_ordenes().subscribe({
      next:res=>{
        this.listaOrdenes = res
        this.dataSource = new MatTableDataSource(this.listaOrdenes);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },error:err=>{
        if(err.error){
          this._util.alerta_error(err.error)
        }else{
          this._util.alerta_error(JSON.stringify(err))
        }
      }
    })
  }

}
