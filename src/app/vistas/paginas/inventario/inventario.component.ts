import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  listaColumnas: any[] = [
    {
      id: 1,
      nombre:'Código',
      col:'Codigo', 
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
      nombre:'Descripción',
      col:'Descripcion',
      mostrar:true
    }
    ,
    {
      id: 5,
      nombre:'Lote',
      col:'Lote',
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
      nombre:'U/M',
      col:'UM',
      mostrar:true
    },
    {
      id: 8,
      nombre:'Stock',
      col:'Stock',
      mostrar:true
    },
    {
      id: 9,
      nombre:'Precio Promedio',
      col:'Precio_Promedio',
      mostrar:false
    },
    {
      id: 10,
      nombre:'Costo Total',
      col:'Costo_Total',
      mostrar:false
    }
  ];
  
  toggleSelection(id: number) {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }
    this.displayedColumns= new Set<string>(); 

    for (const columna of this.listaColumnas) {
      if (this.selectedItems.has(columna.id)) {
        //console.log(this.listaColumnas[columna.id-1].nombre);
        //console.log("After update: ",this.listaColumnas[columna.id-1].mostrar);
        this.listaColumnas[columna.id-1].mostrar = true;
        this.displayedColumns.add(this.listaColumnas[columna.id-1].col);
      }
      else{
        //console.log(this.listaColumnas[columna.id-1].nombre);
        //console.log("After update: ",this.listaColumnas[columna.id-1].mostrar);
        this.listaColumnas[columna.id-1].mostrar = false;
      }
    }
    console.log("After update: ");
    console.log("After update: ", this.listaColumnas);

  }
  
  selectedItems: Set<number> = new Set<number>();
  listaInventarios : any[] = [
    '2023-05-05','2023-05-29','2023-05-30'
  ]

  datos: any[] = [
    {
      "Ubicacion": "N32 - RACK N C3 F2",
      "Caducidad": "11/05/2023",
      "Codigo": 1780,
      "Lote": "LR/7",
      "Descripcion": "CAJA FIDEO CORTO 20 UN DE 350-400 GR",
      "Proveedor": "GRUPO SUPERIOR",
      "UM": "UN",
      "Stock": 3.000000,
      "Precio_Promedio": 35.000000,
      "Costo_Total": "490.00"
    },
    {
      "Ubicacion": "I31 - RACK I C3 F1",
      "Caducidad": "12/05/2023",
      "Codigo": 3219,
      "Lote": "LTR/7",
      "Descripcion": "CAJA FIDEO CORTO 12 UN DE 350-400 GR",
      "Proveedor": "CALBAQ",
      "UM": "UN",
      "Stock": 37.000000,
      "Precio_Promedio": 42.000000,
      "Costo_Total": "1,554.00"
    },
    {
      "Ubicacion": "CC001 - CÁMARA DE CONGELACIÓN 1",
      "Caducidad": "13/05/2023",
      "Codigo": 2169,
      "Lote": "3198C",
      "Descripcion": "UNIDAD CERDO   DE 4.5-5 KG",
      "Proveedor": "P049 - PROCESADORA NACIONAL DE ALIMENTOS C.A. PRONACA",
      "UM": "UN",
      "Stock": 95.000000,
      "Precio_Promedio": 6.600000,
      "Costo_Total": "759.00"
    }
  ]

  /*displayedColumns: string[] = [
    'Codigo', 'Ubicacion','Caducidad','Descripcion','Lote','Proveedor','UM','Stock','Precio_Promedio','Costo_Total'];
*/
  displayedColumns: Set<string> = new Set<string>(); 
  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectProducto = "";

  formData:FormData = new FormData();
  fileFotoUsuario: File | null = null;
  archivoSeleccionado: File | undefined;


  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private _util: UtilService) { 
    this.registerForm = this.formBuilder.group({
      id_producto: [""],
      Codigo: ["",Validators.required],
      Descripcion: ["",Validators.required],
      Ubicacion: ["",Validators.required],
      Lote: ["",Validators.required],
      Proveedor: ["",Validators.required],
      UM: ["",Validators.required],
      Stock: ["",Validators.required],
      Precio_Promedio: ["",Validators.required],
      Costo_Total: ["",Validators.required]
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.datos);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    for (const columna of this.listaColumnas) {
      if (columna.mostrar){
        this.displayedColumns.add(columna.col);
      }

    }
  }

  seleccionarArchivo(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enviarFormulario() {
    if (this.archivoSeleccionado) {
      const formData = new FormData();
      formData.append('archivo', this.archivoSeleccionado, this.archivoSeleccionado.name);

      // Aquí puedes hacer la llamada a tu servicio para enviar el formulario con el archivo
      // utilizando formData como el cuerpo de la solicitud.
      // Por ejemplo:
      // this.tuServicio.enviarArchivo(formData).subscribe(response => {
      //   console.log('Archivo enviado exitosamente');
      // }, error => {
      //   console.error('Error al enviar el archivo', error);
      // });

      console.log('Archivo enviado exitosamente');
    }
  }

  onSubmit():void {
    this.guardarDatosProducto()
  }

  resetForm():void{
    this.selectProducto = ""
    this.isFormVisible = false;
    this.submitted = false;
    this.registerForm.reset();
  }

  guardarDatosProducto(){
    Swal.fire({
      title: 'Confirmación',
      text: 'Se guardará los cambios, ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
        this.submitted = true;
          if (this.registerForm.invalid) {
            return;
          }
          this._util.alerta("Data",JSON.stringify(this.registerForm.value),"info")
      }
    })
  }

  verProductoData(codigo:number):void{
    const producto = this.datos.find((item: { Codigo: number; }) => item.Codigo === codigo);

    if (producto) {
      this.isFormVisible = true;
      this.selectProducto = producto.Descripcion
      this.registerForm.controls["Codigo"].setValue(producto.Codigo)
      this.registerForm.controls["Descripcion"].setValue(producto.Descripcion)
      this.registerForm.controls["Ubicacion"].setValue(producto.Ubicacion)
      this.registerForm.controls["Lote"].setValue(producto.Lote)
      this.registerForm.controls["Proveedor"].setValue(producto.Proveedor)
      this.registerForm.controls["UM"].setValue(producto.UM)
      this.registerForm.controls["Stock"].setValue(producto.Stock)
      this.registerForm.controls["Precio_Promedio"].setValue(producto.Precio_Promedio)
      this.registerForm.controls["Costo_Total"].setValue(producto.Costo_Total)
    } else {
      this._util.alerta("Error","No se encontro la información del Producto.","warning")
    }
  }

  mostrarHistoricoInventarios():void{
    
  }

}
