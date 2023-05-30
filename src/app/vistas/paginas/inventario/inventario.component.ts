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

  listaProductos:any

  displayedColumns: string[] = ['producto', 'peso'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectProducto = "";

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
          this.alerta("Data",JSON.stringify(this.registerForm.value),"info")
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
