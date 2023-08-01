import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Product} from 'src/app/interfaces/interfaces'



import Swal from 'sweetalert2';
import { PlanificadorService } from 'src/app/servicios/planificador.service';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-planificador',
  templateUrl: './planificador.component.html',
  styleUrls: ['./planificador.component.css']
})
export class PlanificadorComponent implements OnInit {


  @Output() mostrarPaginaEvent = new EventEmitter();

  lista_productos_invalidos:any[] = [];

  lista_beneficiados: any[] = []

  lista_stock: any[] = []

  lista_orden: any[] = []

  lista_stock_requerido: any[] = []

  listaColumnas: any[] = [
    {
      id: 1,
      nombre:'Institución Social',
      col:'InstitucionSocial', 
      mostrar:true
    },
    {
      id: 2,
      nombre:'Ubicación',
      col:'Ubicacion',
      mostrar:true
    },
    {
      id: 3,
      nombre:'Caducidad',
      col:'Caducidad',
      mostrar:true
    },
    {
      id: 4,
      nombre:'Código',
      col:'Codigo',
      mostrar:true
    } 
    ,
    {
      id: 5,
      nombre:'Descripción',
      col:'Descripcion',
      mostrar:true
    },
    {
      id: 6,
      nombre:'Proveedor',
      col:'Proveedor',
      mostrar:true
    },
    {
      id: 7,
      nombre:'Precio',
      col:'Precio',
      mostrar:true
    },
    {
      id: 8,
      nombre:'Cantidad',
      col:'Cantidad',
      mostrar:true
    },
    {
      id: 9,
      nombre:'Fecha Orden',
      col:'FechaOrden',
      mostrar:true
    }
  ];


  displayedColumns: Set<string> = new Set<string>(); 
  selectedItems2: Set<number> = new Set<number>();
  dataSource!: MatTableDataSource<any>;
  registerForm: FormGroup;

  selectedItems: Set<number> = new Set<number>();
  beneficiadosEscogidos =new Array();
  beneficiadosNoEscogidos=new Array();

  ordenAceptada : boolean = false;
  numberOrden : number = 0;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatStepper) stepper!: MatStepper;

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private _util: UtilService, private _planificador: PlanificadorService) { 
    this.registerForm = this.formBuilder.group({
      
    });
    
  };

  ngOnInit(): void {

    this.cargarAlertasProductos()
    this.cargarListaBeneficiados()
    this.cargarListaStock()
    
    
  };

  

  cargarAlertasProductos():void{
    this._planificador.listar_productos_invalidos().subscribe({
      next:res=>{
        this.lista_productos_invalidos = res
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }

  cargarListaStock(): void {
    this._planificador.listar_existencias().subscribe({
      next: (res: any[]) => {
        this.lista_stock = res
      },
      error: err => {
        this._util.alerta_error(JSON.stringify(err));
      }
    });
  }

  cargarListaBeneficiados():void{
    this._planificador.listar_beneficiados().subscribe({
      next:res=>{
        this.lista_beneficiados = res
        this.beneficiadosNoEscogidos = this.lista_beneficiados
        this.autoseleccionInicial()
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }

  cargarListaRequerido2(datos: any[]){
    
    const categorias: { [key: number]: Product } = {};
    console.log(datos)
    datos.forEach((beneficiado: any) => {
      beneficiado.productos.forEach((producto: any) => {
        const { cat_pro_id, cat_pro_nombre, suma } = producto;
  
        if (categorias[cat_pro_id]) {
          categorias[cat_pro_id].suma += suma;
        } else {
          categorias[cat_pro_id] = {
            cat_pro_id,
            cat_pro_nombre,
            suma,
          };
        }
      });
    });
  
    const resultado: Product[] = Object.values(categorias);
    this.lista_stock_requerido = resultado
  }

  calcularSumaConPeriodo(suma: number, periodo: number): number {
    const quincenal = 15;
    const mensual = 30;
    const semanal = 7;
  
    if (periodo == quincenal) {
      return suma * 2;
    } else if (periodo == mensual) {
      return suma * 4;
    } else if (periodo == semanal) {
      return suma;
    }
  
    return suma; // Valor predeterminado si el periodo no es reconocido
  }
  
  cargarListaRequerido(datos: any[]){

    const categorias: { [key: number]: Product } = {};
    datos.forEach((beneficiado: any) => {
      beneficiado.productos.forEach((producto: any) => {
        const { cat_pro_id, cat_pro_nombre, suma, beneficiado_periodo } = producto;
        const sumaConPeriodo = this.calcularSumaConPeriodo(suma, beneficiado_periodo);

  
        if (categorias[cat_pro_id]) {
          categorias[cat_pro_id].suma += sumaConPeriodo;
        } else {
          categorias[cat_pro_id] = {
            cat_pro_id,
            cat_pro_nombre,
            suma: sumaConPeriodo,
          };
        }
      });
    });
  
    const resultado: Product[] = Object.values(categorias);
    this.lista_stock_requerido = resultado
  }
  
  verificarCantidades(producto:Product):number{
    var respuesta = producto.suma;
    this.lista_stock.forEach((pro:any) => {
      if(pro.cat_pro_id == producto.cat_pro_id){
        if(pro.suma < producto.suma){
          respuesta = producto.suma - pro.suma
        }else{
          respuesta = 0
        }
      }
    });
    return respuesta
  }

  llamarMostrarPagina(id:number): void {
    this._util.setProducto(id)
    this.mostrarPaginaEvent.emit("Productos");
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

  this.cargarListaRequerido(this.beneficiadosEscogidos);
}

autoseleccionInicial():void{
  this.selectedItems = new Set<number>();
  this.beneficiadosEscogidos = [];
  this.beneficiadosNoEscogidos = [];
  

  for (const beneficiado of this.lista_beneficiados) {
    if(beneficiado.turno == 1){
      this.selectedItems.add(beneficiado.beneficiado_id);
      this.beneficiadosEscogidos.push(beneficiado);
    }else{
      this.beneficiadosNoEscogidos.push(beneficiado);
    }
  }

  this.cargarListaRequerido(this.beneficiadosEscogidos);
}

// Función para deseleccionar a todos los beneficiados
seleccionarNingunoBeneficiados(): void {
  this.selectedItems = new Set<number>();
  this.beneficiadosEscogidos = [];
  this.beneficiadosNoEscogidos = [...this.lista_beneficiados]; // Copia de todos los beneficiados


  this.cargarListaRequerido(this.beneficiadosEscogidos);
}


  toggleSelection2(id: number) {
    if (this.selectedItems2.has(id)) {
      this.selectedItems2.delete(id);
    } else {
      this.selectedItems2.add(id);
    }
    this.displayedColumns= new Set<string>(); 

    for (const columna of this.listaColumnas) {
      if (this.selectedItems2.has(columna.id)) {
        this.listaColumnas[columna.id-1].mostrar = true;
        this.displayedColumns.add(this.listaColumnas[columna.id-1].col);
      }
      else{
        this.listaColumnas[columna.id-1].mostrar = false;
      }
    }

  }
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };


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

  this.cargarListaRequerido(this.beneficiadosEscogidos)

  };

  cargarOrden(numeroOrden:any):void{
    this._planificador.obtener_orden(numeroOrden).subscribe({
      next:res=>{
        this.numberOrden = numeroOrden;
        this.lista_orden = res;
        this.dataSource = new MatTableDataSource(this.lista_orden);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        //this.beneficiadosNoEscogidos=this.listaBeneficiados;
        for (const columna of this.listaColumnas) {
          if (columna.mostrar){
            this.displayedColumns.add(columna.col);
          }

        }
        this.stepper.next()
      },error:err=>{
        if(err.error){
          this._util.alerta_error(err.error)
        }else{
          this._util.alerta_error(JSON.stringify(err))
        }
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

  reset():void{
    Swal.fire({
      title: 'Confirmación',
      text: 'Se reiniciará el proceso ¿Continuar?',
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
          this.seleccionarNingunoBeneficiados();
          this.stepper.reset();
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

  enviar() {

    Swal.fire({
      title: 'Confirmación',
      text: 'Se generará una orden con los parámetros seleccionados ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
        if(this.beneficiadosEscogidos.length>0){
          // Lógica para enviar los IDs seleccionados
          this._planificador.generarOrdenAlimentos(this.beneficiadosEscogidos).subscribe({
            next:res=>{
              this.cargarOrden(res.orden)
            },error:err=>{
              if(err.error){
                this._util.alerta_error(err.error)
              }else{
                this._util.alerta_error(JSON.stringify(err))
              }
            }
          })
        }else{
          this._util.alerta("Alerta","No se han escogido beneficiarios","warning")
        }
      }
    })   

  };

}
