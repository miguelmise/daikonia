import { ChangeDetectorRef, Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlanificadorService } from 'src/app/servicios/planificador.service';
import { ProductosService } from 'src/app/servicios/productos.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import { finalize } from 'rxjs';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.component.html',
  styleUrls: ['./repartidor.component.css']
})
export class RepartidorComponent implements OnInit {


  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  displayedColumns: string[] = ['InstitucionSocial', 'Ubicacion', 'Caducidad', 'Codigo', 'Descripcion', 'Proveedor', 'Precio', 'Cantidad', 'FechaOrden'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  progreso :number = 25
  productoSeleccionado:number = 0
  nombre_producto:string = ""
  stock:number = 0
  cantidad_repartir:number = 0
  numero_beneficiados:number = 0

  lista_orden: any[] = []
  ordenAceptada : boolean = false;
  numberOrden : number = 0;

  lista_beneficiados: any[] = []
  listaProductos: any[] = []
  selectedItems: Set<number> = new Set<number>();
  beneficiadosEscogidos =new Array();
  beneficiadosNoEscogidos=new Array();

  constructor(private _util: UtilService, private _planificador: PlanificadorService, private cdr: ChangeDetectorRef, private _producto : ProductosService) { }

  ngOnInit(): void {
    this.cargarListaBeneficiados()
    this.cargarListaProductos()
  }

  enviar(){
    Swal.fire({
      title: 'Confirmación',
      text: 'Se Generará una orden ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
        const data_para_orden = {
          codigo_producto: this.productoSeleccionado,
          cantidad_repartir: this.cantidad_repartir,
          beneficiados: this.beneficiadosEscogidos
        };
        if((this.cantidad_repartir * this.beneficiadosEscogidos.length) <= this.stock){
          // Lógica para enviar los IDs seleccionados
          this._planificador.repartirProductos(data_para_orden).subscribe({
            next:res=>{
              this.cargarOrden(res.orden)
              this.dataSource = new MatTableDataSource(this.lista_orden);
              this.cdr.detectChanges();
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.progreso = 100;
            },error:err=>{
              if(err.error){
                this._util.alerta_error(err.error)
              }else{
                this._util.alerta_error(JSON.stringify(err))
              }
            }
          })
        }else{
          this._util.alerta("Alerta","No hay stock suficiente para generar la orden, se necesita: "+(this.cantidad_repartir * this.beneficiadosEscogidos.length)+" productos","warning")
        }
      }
    })   
  }

  cargarOrden(numeroOrden:any):void{
    this._planificador.obtener_orden(numeroOrden)
    .pipe(finalize(() => {
      this.dataSource = new MatTableDataSource(this.lista_orden);
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.progreso = 100;
    }))
    .subscribe({
      next:res=>{
        this.numberOrden = numeroOrden;
        this.lista_orden = res;
        

      },error:err=>{
        if(err.error){
          this._util.alerta_error(err.error)
        }else{
          this._util.alerta_error(JSON.stringify(err))
        }
      }
    })
  }
  

  avanzar(){
    if (this.progreso < 100) {
      this.progreso += 25; // Incrementa el valor del progreso en 25
    }
    
  }

  reiniciar(){
    Swal.fire({
      title: 'Confirmación',
      text: 'Se Reiniciará el proceso, no se guardará los cambios. ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
        this._planificador.cancelar_orden().subscribe({
          next:res=>{
            this.progreso = 25;
            this.cargarListaBeneficiados()
            this.cargarListaProductos()
            this.seleccionarNingunoBeneficiados()
            this.productoSeleccionado = 0
            this.stock  = 0
            this.cantidad_repartir = 0
            this.numero_beneficiados = 0
            this.nombre_producto = ""
            this.ordenAceptada = false;
            this.numberOrden = 0;
          },error:err=>{
            if(err.error){
              this._util.alerta_error(err.error)
            }else{
              this._util.alerta_error(JSON.stringify(err))
            }
          }
        })
      }
    })
  }

  confirmarOrden():void{
    Swal.fire({
      title: 'Confirmación',
      text: 'Se confirmará la órden, esta acción no se puede deshacer ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
         this._planificador.confirmarOrden(this.numberOrden).subscribe({
          next:res=>{
            this.ordenAceptada = true;
            if(res.mensaje){
              this._util.alerta_success(res.mensaje)
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
    })
  }

  beneficiados():number{
    return this.beneficiadosEscogidos.length
  }

  seleccionar_producto():void{
    if(this.productoSeleccionado != 0){
      this.listaProductos.forEach((element:any) => {
        if(element.producto_codigo == this.productoSeleccionado){
          this.stock = element.stock
          this.nombre_producto = element.producto_sku
          return
        }
      })
    }else{
      this.stock = 0
    }
  }

  cargarListaProductos():void{
    this._producto.listar_productos().subscribe({
      next: res=>{
        this.listaProductos = res.filter((element: any) => element.stock > 0);
      },
      error: err=>{
        this._util.alerta_error(JSON.stringify(err));
      }
    })
  }

  cargarListaBeneficiados():void{
    this._planificador.listar_beneficiados().subscribe({
      next:(res:any)=>{
        this.lista_beneficiados = res
        this.beneficiadosNoEscogidos = this.lista_beneficiados
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }

  
  // Función para seleccionar todos los beneficiados
seleccionarTodosBeneficiados(): void {
  this.selectedItems = new Set<number>();
  this.beneficiadosEscogidos = [];
  this.beneficiadosNoEscogidos = []; // Copia de todos los beneficiados

  for (const beneficiado of this.lista_beneficiados) {
    this.selectedItems.add(beneficiado.beneficiado_id);
    this.beneficiadosEscogidos.push(beneficiado);
  }

}

// Función para deseleccionar a todos los beneficiados
seleccionarNingunoBeneficiados(): void {
  this.selectedItems = new Set<number>();
  this.beneficiadosEscogidos = [];
  this.beneficiadosNoEscogidos = [...this.lista_beneficiados]; // Copia de todos los beneficiados

}

toggleSelection(id: number) {
  this.beneficiadosEscogidos=new Array();
  this.beneficiadosNoEscogidos=new Array();
  if (this.selectedItems.has(id)) {
    this.selectedItems.delete(id);
    
  } else {
    this.selectedItems.add(id);
  }

for (const beneficiado of this.lista_beneficiados) {
  if (this.selectedItems.has(beneficiado.beneficiado_id)) {
    this.beneficiadosEscogidos.push(beneficiado);
  }
  else{
    this.beneficiadosNoEscogidos.push(beneficiado);
    //this.listaBeneficiados.push(beneficiado)
  }
};
this.beneficiadosNoEscogidos = this.beneficiadosNoEscogidos.filter((item,index)=>{
  return this.beneficiadosNoEscogidos.indexOf(item) === index;
})

}

informacion(){
  Swal.fire({
    html: `<p>Distribuye un único producto de manera equivalente a las instituciones seleccionadas, independiente a la cantidad de personas que tenga cada institución.</p>
    <p><b>Pasos a seguir:</b></p>
    <ol>
      <li>Seleccione las instituciones.</li>
      <li>Escoja un solo producto y la cantidad a repartir.</li>
      <li>Dar clic en generar: Se repartirá la misma cantidad para cada fundación.</li>
    </ol>
    <br>
    `,
    icon: 'info',
    confirmButtonColor: '#006e8c'
  })
}

}
