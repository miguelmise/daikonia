import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Product} from 'src/app/interfaces/interfaces'



import Swal from 'sweetalert2';
import { PlanificadorService } from 'src/app/servicios/planificador.service';


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
    },
    {
      id: 10,
      nombre:'Usuario',
      col:'Usuario',
      mostrar:true
    }
  ];



  datos: any[] = [
    {
      id: 1,
      "InstitucionSocial": "Ciudadela Reeducativa Sembradores De Vida",
      "Ubicacion": "A11 - RACK A C1 F1",
      "Caducidad": "11/05/2023",
      "Codigo": "2072",
      "Descripcion": "UNIDAD ATUN DE 150-200 GR",
      "Proveedor": "P145 - TIENDAS INDUSTRIALES ASOCIADAS TIA S.A",
      "Precio": 0.30,
      "Cantidad": 3.000000,
      "FechaOrden": "12/05/2023",
      "Usuario": "saintria",
      agrega:false
    },
    {
      id: 12,
      "InstitucionSocial": "Fundación Puro Corazón",
      "Ubicacion": "A11 - RACK A C1 F1",
      "Caducidad": "11/05/2023",
      "Codigo": "2082",
      "Descripcion": "UNIDAD CAFÉ DE 0-50 GR",
      "Proveedor": "P145 - TIENDAS INDUSTRIALES ASOCIADAS TIA S.A",
      "Precio": 0.57,
      "Cantidad": 3.000000,
      "FechaOrden": "12/05/2023",
      "Usuario": "saintra",
      agrega:false
    },
    {
      id: 13,
      "InstitucionSocial": "Fundación Caminando Juntos por el Cambio Sira Macias",
      "Ubicacion": "A11 - RACK A C1 F1",
      "Caducidad": "11/05/2023",
      "Codigo": "2085",
      "Descripcion": "UNIDAD SAL DE 950-1000 GR",
      "Proveedor": "P145 - TIENDAS INDUSTRIALES ASOCIADAS TIA S.A",
      "Precio": 0.55,
      "Cantidad": 3.000000,
      "FechaOrden": "12/05/2023",
      "Usuario": "saintria",
      agrega:false
    },
    {
      id: 14,
      "InstitucionSocial": "Iglesia del Nazareno Jesús La Esperanza",
      "Ubicacion": "A11 - RACK A C1 F1",
      "Caducidad": "11/05/2023",
      "Codigo": "2085",
      "Descripcion": "UNIDAD SAL DE 950-1000 GR",
      "Proveedor": "P145 - TIENDAS INDUSTRIALES ASOCIADAS TIA S.A",
      "Precio": 0.55,
      "Cantidad": 3.000000,
      "FechaOrden": "12/05/2023",
      "Usuario": "saintria",
      agrega:false
    }
  ];

  displayedColumns: Set<string> = new Set<string>(); 
  selectedItems2: Set<number> = new Set<number>();
  dataSource!: MatTableDataSource<any>;
  registerForm: FormGroup;
  generaOrden=false;

  selectedItems: Set<number> = new Set<number>();
  //numBeneficiados: number = 0;
  //numpersonas: number = 0;
  //kgRequerido: number = 0;
  datosPresentar =new Array();
  beneficiadosEscogidos =new Array();
  beneficiadosNoEscogidos=new Array();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private _util: UtilService, private _planificador: PlanificadorService) { 
    this.registerForm = this.formBuilder.group({
      
    });
    
  };

  ngOnInit(): void {

    this.cargarAlertasProductos()
    this.cargarListaBeneficiados()
    this.cargarListaStock()
    
    
    this.dataSource = new MatTableDataSource(this.datosPresentar);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.beneficiadosNoEscogidos=this.listaBeneficiados;
    for (const columna of this.listaColumnas) {
      if (columna.mostrar){
        this.displayedColumns.add(columna.col);
      }

    }
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
      next: res => {
        this.lista_stock = res
        console.log(this.lista_stock);
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
        console.log(this.lista_beneficiados)
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }
  
  cargarListaRequerido(datos: any[]){
    const categorias: { [key: number]: Product } = {};
    
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
    console.log(resultado)
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

seleccionarTodosBeneficiados(): void {
  this.selectedItems = new Set<number>();
  this.beneficiadosEscogidos = [];
  this.beneficiadosNoEscogidos = [...this.lista_beneficiados]; // Copia de todos los beneficiados

  for (const beneficiado of this.lista_beneficiados) {
    this.selectedItems.add(beneficiado.beneficiado_id);
    this.beneficiadosEscogidos.push(beneficiado);
  }

  this.cargarListaRequerido(this.beneficiadosEscogidos);
}

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

  muestraOrden(valor:boolean){
    if(this.beneficiadosEscogidos.length>0){
      this.generaOrden=valor;
    }else{
      this._util.alerta("Alerta","No se han escogido beneficiarios","warning")
    }
    
  };

  resultado: string = '';



  confirmDialog() {
    Swal.fire({
      title: 'Confirmación',
      text: 'Se confirmará la Orden ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
         this.resultado="true"; 
          console.log("Estoy aceptando");
          //aqui va lo que pasa si dan click en aceptar
      }else{
        console.log("No Estoy aceptando");
        this.beneficiadosEscogidos=new Array();
        //this.beneficiadosNoEscogidos=this.listaBeneficiados;
      }
    })
  }
 
  rechazarOrden() {
    Swal.fire({
      title: 'Confirmación',
      text: 'Se rechazará la Orden, ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
         this.resultado="true"; 
          console.log("Estoy aceptando Rechazar");
          this.beneficiadosEscogidos=new Array();
          //this.beneficiadosNoEscogidos=this.listaBeneficiados;

      }
    })
    
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
      //this.beneficiadosNoEscogidos=this.listaBeneficiados.filter((item) => item.id !== beneficiado.id);

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

  enviar() {
    // Lógica para enviar los IDs seleccionados
    this.datosPresentar =new Array();
    console.log(this.beneficiadosEscogidos)
    for(const genera of this.datos){
      if (this.selectedItems.has(genera.id)) {
        this.datosPresentar.push(genera);
      }
    }
    this.dataSource = new MatTableDataSource(this.datosPresentar);
    this.muestraOrden(true);
  };

}
