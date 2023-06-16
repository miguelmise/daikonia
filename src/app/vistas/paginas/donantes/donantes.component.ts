import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DonantesService } from 'src/app/servicios/donantes.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-donantes',
  templateUrl: './donantes.component.html',
  styleUrls: ['./donantes.component.css']
})
export class DonantesComponent implements OnInit {

  listaProveedores: any[] = [];
  update_donante = true;
  
  tipos_proveedor: any[] = [
    { valor: "PUBLICO", etiqueta: "Público" },
    { valor: "PRIVADO", etiqueta: "Privado" },
    { valor: "COMUNIDAD", etiqueta: "Comunidad" },
    { valor: "ANONIMO", etiqueta: "Anonimo" },
    { valor: "OTRO", etiqueta: "Otro" }]

  estados: any[] = [
    { valor: "1", etiqueta: "Activo" },
    { valor: "0", etiqueta: "Inactivo" }]

  displayedColumns: string[] = ['nombreProveedor', 'tipo'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectProveedor = "";
  

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private _util: UtilService,
    private _donante :DonantesService) { 
    this.registerForm = this.formBuilder.group({
      donante_id: [""],
      donante_nombre: ["",Validators.required],
      donante_tipo: ["",Validators.required],
      donante_descripcion: [""],
      donante_estado: ["",Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarListaDonantes()
  }

  onSubmit():void {
    this.guardarDatosProveedor()
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarListaDonantes():void{
    this._donante.listar_donantes().subscribe({
      next: result =>{
        this.listaProveedores = result
        this.dataSource = new MatTableDataSource(this.listaProveedores);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error : e => {
        this._util.alerta("Error",JSON.stringify(e),"warning")
      }
    })
    
  }

  resetForm():void{
    this.update_donante = false;
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
          if(this.update_donante){
            this._donante.update_donante(this.registerForm.value)
            .subscribe({
              next: result =>{
                this._util.alerta("Procesado",JSON.stringify(result.mensaje),"info")
                this.cargarListaDonantes()
              },error : e =>{
                this._util.alerta("Error",JSON.stringify(e),"error")
              }
            })
          }else{
            this._donante.create_donante(this.registerForm.value)
            .subscribe({
              next: result =>{
                this._util.alerta("Procesado",JSON.stringify(result.mensaje),"info")
                this.cargarListaDonantes()
              },error : e =>{
                this._util.alerta("Error",JSON.stringify(e),"error")
              }
            })
          }
          
      }
    })
  }

  verProveedorData(id:number):void{
    const proveedor = this.listaProveedores.find((item: { donante_id: number; }) => item.donante_id === id);

    if (proveedor) {
      this.update_donante = true;
      this.isFormVisible = true;
      this.selectProveedor = proveedor.nombre_proveedor
      this.registerForm.controls["donante_id"].setValue(proveedor.donante_id)
      this.registerForm.controls["donante_nombre"].setValue(proveedor.donante_nombre)
      this.registerForm.controls["donante_tipo"].setValue(proveedor.donante_tipo)
      this.registerForm.controls["donante_descripcion"].setValue(proveedor.donante_descripcion)
      this.registerForm.controls["donante_estado"].setValue(proveedor.donante_estado)
    } else {
      this._util.alerta("Error","No se encontro la información del Proveedor.","warning")
    }
  }


}
