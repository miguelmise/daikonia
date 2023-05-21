import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-donantes',
  templateUrl: './donantes.component.html',
  styleUrls: ['./donantes.component.css']
})
export class DonantesComponent implements OnInit {

  /**Data de prueba */
  listaProveedores: any[] = [
    { id: 1, nombre_proveedor: "GRUPO SUPERIOR", tipo: "público", descripcion: "" },
    { id: 2, nombre_proveedor: "CALBAQ", tipo: "privado", descripcion: "" },
    { id: 3, nombre_proveedor: "P049 - PROCESADORA NACIONAL DE ALIMENTOS C.A. PRONACA", tipo: "comunidad", descripcion: "" },
    { id: 4, nombre_proveedor: "UNILEVER", tipo: "público", descripcion: "" },
    { id: 5, nombre_proveedor: "KELLOGS", tipo: "privado", descripcion: "" },
    { id: 6, nombre_proveedor: "NESTLE", tipo: "comunidad", descripcion: "" },
    { id: 7, nombre_proveedor: "P050 - KELLOGGS ECUADOR C. LTDA", tipo: "público", descripcion: "" },
    { id: 8, nombre_proveedor: "P151 - NESTLE ECUADOR S.A.", tipo: "privado", descripcion: "" },
    { id: 9, nombre_proveedor: "NIRSA", tipo: "comunidad", descripcion: "" },
    { id: 10, nombre_proveedor: "P046 - TIOSA S.A.", tipo: "público", descripcion: "" },
    { id: 11, nombre_proveedor: "MEGA SANTAMARIA", tipo: "privado", descripcion: "" },
    { id: 12, nombre_proveedor: "P231 - PRODUCTOS CRIS C LTDA.", tipo: "comunidad", descripcion: "" },
    { id: 13, nombre_proveedor: "LABORATORIO P G", tipo: "público", descripcion: "" },
    { id: 14, nombre_proveedor: "LEVAPAN", tipo: "privado", descripcion: "" },
    { id: 15, nombre_proveedor: "P068 - BANCO DE ALIMENTOS DIAKONIA", tipo: "comunidad", descripcion: "" },
    { id: 16, nombre_proveedor: "ECUASAL", tipo: "público", descripcion: "" },
    { id: 17, nombre_proveedor: "TOSCANA", tipo: "privado", descripcion: "" },
    { id: 18, nombre_proveedor: "ALIMENTOS POLAR", tipo: "comunidad", descripcion: "" },
    { id: 19, nombre_proveedor: "FARMAYALA", tipo: "público", descripcion: "" },
    { id: 20, nombre_proveedor: "DIFARE", tipo: "privado", descripcion: "" },
    { id: 21, nombre_proveedor: "BDA", tipo: "comunidad", descripcion: "" },
    { id: 22, nombre_proveedor: "HISPANA", tipo: "público", descripcion: "" },
    { id: 23, nombre_proveedor: "TIENDITA", tipo: "privado", descripcion: "" },
    { id: 24, nombre_proveedor: "PLASTIEMPAQUE", tipo: "comunidad", descripcion: "" },
  ];
  
  tipos_proveedor: any[] = [
    { valor: "público", etiqueta: "Público" },
    { valor: "privado", etiqueta: "Privado" },
    { valor: "comunidad", etiqueta: "Comunidad" },
    { valor: "personal", etiqueta: "Personal" },
    { valor: "anonimo", etiqueta: "Anonimo" }]

  displayedColumns: string[] = ['nombreProveedor', 'tipo'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectProveedor = "";
  

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder) { 
    this.registerForm = this.formBuilder.group({
      id: [""],
      nombre_proveedor: ["",Validators.required],
      tipo: ["",Validators.required],
      descripcion: [""]
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.listaProveedores);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit():void {
    this.guardarDatosProveedor()
  }

  resetForm():void{
    this.selectProveedor = "[Nuevo Proveedor]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
  }

  guardarDatosProveedor(){
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

  verProveedorData(id:number):void{
    const proveedor = this.listaProveedores.find((item: { id: number; }) => item.id === id);

    if (proveedor) {
      this.isFormVisible = true;
      this.selectProveedor = proveedor.nombre_proveedor
      this.registerForm.controls["id"].setValue(proveedor.id)
      this.registerForm.controls["nombre_proveedor"].setValue(proveedor.nombre_proveedor)
      this.registerForm.controls["tipo"].setValue(proveedor.tipo)
      this.registerForm.controls["descripcion"].setValue(proveedor.descripcion)
    } else {
      //this.alerta("Error","No se encontro la información del usuario.","warning")
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

}
