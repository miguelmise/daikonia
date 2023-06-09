import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import { InventarioService } from 'src/app/servicios/inventario.service';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

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
      mostrar:false
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
      mostrar:true
    },
    {
      id: 10,
      nombre:'Costo Total',
      col:'Costo_Total',
      mostrar:true
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
        this.listaColumnas[columna.id-1].mostrar = true;
        this.displayedColumns.add(this.listaColumnas[columna.id-1].col);
      }
      else{
        this.listaColumnas[columna.id-1].mostrar = false;
      }
    }

  }
  
  selectedItems: Set<number> = new Set<number>();
  listaInventarios : any[] = [
    '2023-05-05','2023-05-29','2023-05-30'
  ]

  datos2: any[] = [
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

  datos: any[] = []

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


  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private _util: UtilService, private _inventario: InventarioService) { 
    this.registerForm = this.formBuilder.group({
      inventario_id: [""],
      inventario_codigo: ["",Validators.required],
      inventario_descripcion: ["",Validators.required],
      inventario_ubicacion: ["",Validators.required],
      inventario_lote: ["",Validators.required],
      inventario_proveedor: ["",Validators.required],
      inventario_um: ["",Validators.required],
      inventario_stock: ["",Validators.required],
      inventario_precio_promedio: ["",Validators.required],
      inventario_costo_total: ["",Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarTablaInventario()
    
  }

  cargarTablaInventario():void{
    this._inventario.listar_inventario().subscribe({
      next:res=>{
        this.datos = res
        this.dataSource = new MatTableDataSource(this.datos);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        for (const columna of this.listaColumnas) {
          if (columna.mostrar){
            this.displayedColumns.add(columna.col);
          }

        }
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }

  seleccionarArchivo(event: any) {
    this.archivoSeleccionado = event.target.files[0];

    if (this.archivoSeleccionado) {
      const extension = this.archivoSeleccionado.name.split('.').pop()?.toLowerCase();
      
      if (extension !== 'xlsx' && extension !== 'xls') {
        this._util.alerta_error("Por favor, seleccione un archivo de Excel válido.")
      }
    }
  }

  async procesarArchivo(): Promise<void> {
    if (this.archivoSeleccionado) {
      const fileReader = new FileReader();

      fileReader.onload = async (e: any) => {
        const buffer = e.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0];
        const jsonData = worksheet.getSheetValues();

        //console.log(jsonData);
        this._inventario.cargarArchivoInventario(jsonData).subscribe({
          next:res=>{
            if(res.productos_ingresados){
              this._util.alerta_success('Productos añadidos: '+res.productos_ingresados+' Productos Nuevos: '+res.productos_nuevos+' Donantes Nuevos: '+res.proveedores_nuevos)
              this.cargarTablaInventario()
              this.fileInputRef.nativeElement.value = '';
            }else if(res.error){
              this._util.alerta_error(res.error)
              this.fileInputRef.nativeElement.value = '';
            }else{
              this._util.alerta_info(JSON.stringify(res))
              this.fileInputRef.nativeElement.value = '';
            }
          },error:err=>{
            this._util.alerta_error(JSON.stringify(err))
          }
        })
        
      };

      fileReader.readAsArrayBuffer(this.archivoSeleccionado);
    }
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enviarFormulario() {
    if (this.archivoSeleccionado) {
      const formData = new FormData();
      formData.append('archivo', this.archivoSeleccionado, this.archivoSeleccionado.name);

      

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
          this._inventario.actualizar_Inventario(this.registerForm.value).subscribe({
            next:res=>{
              if(res.mensaje){
                this._util.alerta_success(res.mensaje)
              }else{
                this._util.alerta_info(JSON.stringify(res))
              }
              
              this.cargarTablaInventario()
            },error:err=>{
              this._util.alerta_error(JSON.stringify(err))
            }
          })
          
      }
    })
  }

  costoTotal():number{
    return this.registerForm.controls["inventario_precio_promedio"].value * this.registerForm.controls["inventario_stock"].value;
  }

  verProductoData(codigo:number):void{
    const producto = this.datos.find((item: { inventario_id: number; }) => item.inventario_id === codigo);

    if (producto) {
      this.isFormVisible = true;
      this.selectProducto = producto.inventario_descripcion
      this.registerForm.controls["inventario_id"].setValue(producto.inventario_id)
      this.registerForm.controls["inventario_codigo"].setValue(producto.inventario_codigo)
      this.registerForm.controls["inventario_descripcion"].setValue(producto.inventario_descripcion)
      this.registerForm.controls["inventario_ubicacion"].setValue(producto.inventario_ubicacion)
      this.registerForm.controls["inventario_lote"].setValue(producto.inventario_lote)
      this.registerForm.controls["inventario_proveedor"].setValue(producto.inventario_proveedor)
      this.registerForm.controls["inventario_um"].setValue(producto.inventario_um)
      this.registerForm.controls["inventario_stock"].setValue(producto.inventario_stock)
      this.registerForm.controls["inventario_precio_promedio"].setValue(producto.inventario_precio_promedio)
      this.registerForm.controls["inventario_costo_total"].setValue(producto.inventario_costo_total)
    } else {
      this._util.alerta("Error","No se encontro la información del Producto.","warning")
    }
  }

  mostrarHistoricoInventarios():void{
    
  }

}
