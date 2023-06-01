import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  listaInventarios : any[] = [
    '2023-05-05','2023-05-29','2023-05-30'
  ]

  datos: any[] = [
    {
      "Ubicacion": "N32 - RACK N C3 F2",
      "Caducidad": "11/05/2023",
      "Codigo": 1780,
      "Lote": "LR/7",
      "Descripción": "CAJA FIDEO CORTO 20 UN DE 350-400 GR",
      "Proveedor": "GRUPO SUPERIOR",
      "U/M": "UN",
      "Stock": 3.000000,
      "Precio_Promedio": 35.000000,
      "Costo_Total": "490.00"
    },
    {
      "Ubicacion": "I31 - RACK I C3 F1",
      "Caducidad": "12/05/2023",
      "Codigo": 3219,
      "Lote": "LTR/7",
      "Descripción": "CAJA FIDEO CORTO 12 UN DE 350-400 GR",
      "Proveedor": "CALBAQ",
      "U/M": "UN",
      "Stock": 37.000000,
      "Precio_Promedio": 42.000000,
      "Costo_Total": "1,554.00"
    },
    {
      "Ubicacion": "CC001 - CÁMARA DE CONGELACIÓN 1",
      "Caducidad": "13/05/2023",
      "Codigo": 2169,
      "Lote": "3198C",
      "Descripción": "UNIDAD CERDO   DE 4.5-5 KG",
      "Proveedor": "P049 - PROCESADORA NACIONAL DE ALIMENTOS C.A. PRONACA",
      "U/M": "UN",
      "Stock": 95.000000,
      "Precio_Promedio": 6.600000,
      "Costo_Total": "759.00"
    }
  ]

  displayedColumns: string[] = [
    'Codigo', 'Ubicacion'];

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


  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder) { 
    this.registerForm = this.formBuilder.group({
      id_producto: [""],
      nombre_producto: ["",Validators.required],
      precio: ["",Validators.required],
      peso: ["",Validators.required],
      grasa: ["",Validators.required],
      azucar: ["",Validators.required],
      fibra: ["",Validators.required]
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.datos);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccionarArchivo(event: any) {
    this.archivoSeleccionado = event.target.files[0];
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

  resetForm():void{
    this.selectProducto = "[Nuevo Producto]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
  }

  onSubmit():void {
    this.guardarDatosProducto()
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
          this.alerta("Data",JSON.stringify(this.registerForm.value),"info")
      }
    })
  }

  verProductoData(id:number):void{
    const producto = this.datos.find((item: { codigo: number; }) => item.codigo === id);

    if (producto) {
      this.isFormVisible = true;
      this.selectProducto = producto.Nombre
      this.registerForm.controls["id_producto"].setValue(producto.codigo)
      this.registerForm.controls["nombre_producto"].setValue(producto.Nombre)
      this.registerForm.controls["precio"].setValue(producto.precio)
      this.registerForm.controls["peso"].setValue(producto.peso)
      this.registerForm.controls["grasa"].setValue(producto.grasa)
      this.registerForm.controls["azucar"].setValue(producto.azucar)
      this.registerForm.controls["fibra"].setValue(producto.fibra)
    } else {
      this.alerta("Error","No se encontro la información del Producto.","warning")
    }
  }

  alerta(titulo:string,contenido:string,icono:any){
    Swal.fire({
      title:titulo,
      text:contenido,
      toast:true,
      icon:icono,
      confirmButtonColor: '#d21e2a'
    })
  }

  mostrarHistoricoInventarios():void{
    
  }

}
