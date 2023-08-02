import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import { PlanificadorService } from 'src/app/servicios/planificador.service';
import Swal from 'sweetalert2';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { finalize } from 'rxjs';

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

  constructor(private _util : UtilService, private _planificador : PlanificadorService, private cdr: ChangeDetectorRef, private _inventario: InventarioService) { }

  ngOnInit(): void {
    this.cargarListaOrdenes();
  }

  botonInactivo(fecha:any):boolean{
    //Si ha pasado mas de 24horas el boton ya no esta activo
    var fechaActual = new Date();
    var fechaOrden = new Date(fecha);
    if((fechaActual.getTime() - fechaOrden.getTime()) >= 86400000){
      return true;
    }else{
      return false;
    }
    return true;
  }

  devolverProducto(data:any):void{
    if(this.botonInactivo(data.orden_fecha_emision)){
      this._util.alerta_info("No se puede devolver al inventario un producto si ya han pasado 24 horas.")
    }else{
      Swal.fire({
        title: 'Confirmación',
        text: 'El producto se devolverá al inventario, esta acción no se puede revertir, ¿Continuar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#1cc88a',
        toast:true
      }).then((result)=>{
        if(result.value){
          Swal.fire({
            title: 'Ingresa Nueva Ubicación:',
            input: 'text',
            inputValue: data.orden_producto_ubicacion,
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#1cc88a',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: (texto) => {
              data.orden_producto_ubicacion = texto;
              if (!texto) {
                Swal.showValidationMessage('El campo no puede estar vacío');
              }
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              this._inventario.devolver_producto(data)
              .pipe(finalize(() => {
                this.cargarOrden(data.orden_codigo)
              }))
              .subscribe({
                next:(res:any)=>{
                  if(res.mensaje){
                    this._util.alerta_success(res.mensaje)
                    this.cargarListaOrdenes()
                    
                  }else{
                    this._util.alerta_info(JSON.stringify(res))
                  }
                },error:err=>{
                  if(err.error){
                    this._util.alerta_error(err.error)
                  }else{
                    this._util.alerta_error(JSON.stringify(err))
                  }
                }
              })
            }
          });
        }
      })
    }
  }

  cargarOrden(id:any):void{
    this._planificador.obtener_orden(id).subscribe({
      next:res=>{
        //this.ordenAlimentos = res
        this.ordenAlimentos = res.filter((element: any) => element.orden_estado !== 3);
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
