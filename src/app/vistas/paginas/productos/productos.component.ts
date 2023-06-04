import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  /**Data de prueba */
  listaProductos: any[] = [
    {
      "codigo": 1447,
      "Nombre": "CAJA DE PULP 12 UND DE 1 LTR C/U",
      "precio": 10.99,
      "peso": 12.5,
      "grasa": 5.2,
      "azucar": 12.8,
      "fibra": 3.7
    },
    {
      "codigo": 1320,
      "Nombre": "CAFE INSTANTANEO 40 UND X 50 GR",
      "precio": 5.99,
      "peso": 2.0,
      "grasa": 0.2,
      "azucar": 0.0,
      "fibra": 1.0
    },
    {
      "codigo": 28,
      "Nombre": "CAFE SELLO ROJO 360 G",
      "precio": 8.49,
      "peso": 0.36,
      "grasa": 0.0,
      "azucar": 0.0,
      "fibra": 0.0
    },
    {
      "codigo": 2683,
      "Nombre": "CAJA AVENA 24 UN DE 150-200 GR",
      "precio": 12.99,
      "peso": 0.175,
      "grasa": 2.5,
      "azucar": 0.5,
      "fibra": 6.2
    },
    {
      "codigo": 2596,
      "Nombre": "CAJA CEREAL 16 UN DE 350-400 GR",
      "precio": 6.79,
      "peso": 0.375,
      "grasa": 1.0,
      "azucar": 8.5,
      "fibra": 2.5
    },
    {
      "codigo": 3442,
      "Nombre": "CAJA FRUTAS DE 9.07 KG",
      "precio": 18.99,
      "peso": 9.07,
      "grasa": 0.3,
      "azucar": 15.6,
      "fibra": 7.9
    },
    {
      "codigo": 2709,
      "Nombre": "CAJA GALLETA 6 UN DE 100-150 GR",
      "precio": 4.29,
      "peso": 0.12,
      "grasa": 3.8,
      "azucar": 4.2,
      "fibra": 0.5
    },
    {
      "codigo": 2985,
      "Nombre": "CAJA YOGURT 4 UN DE 650-700 GR",
      "precio": 3.99,
      "peso": 0.675,
      "grasa": 2.0,
      "azucar": 12.5,
      "fibra": 0.0
    },
    {
      "codigo": 2159,
      "Nombre": "CAJA ACEITE 15 UN DE 950-1000 ML",
      "precio": 15.49,
      "peso": 0.975,
      "grasa": 90.0,
      "azucar": 0.0,
      "fibra": 0.0
    }
  ];

  displayedColumns: string[] = ['producto', 'peso'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectProducto = "";

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private _util: UtilService) { 
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
    this.dataSource = new MatTableDataSource(this.listaProductos);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
          this._util.alerta("Data",JSON.stringify(this.registerForm.value),"info")
      }
    })
  }

  verProductoData(id:number):void{
    const producto = this.listaProductos.find((item: { codigo: number; }) => item.codigo === id);

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
      this._util.alerta("Error","No se encontro la información del Producto.","warning")
    }
  }


}
