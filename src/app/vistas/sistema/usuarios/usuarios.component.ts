import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  data : any = [
    {id : 1,user : 'admin', nombre : 'Administrador', correo : 'admin@dk.com', rol : 'admin', estado: 1},
    {id : 2,user : 'sintriago', nombre : 'Sandy Intriago', correo : 'sintrig@dk.com', rol : 'user', estado: 1}]

  /* tipos de rol - esta lista deberia cargarse usando un servicio que verifique los roles existentes*/
  roles: any[] = [
    { valor: "admin", etiqueta: "Administrador" },
    { valor: "user", etiqueta: "Usuario" }]

  /* tipos de estado - esta lista deberia cargarse usando un servicio que verifique los roles existentes*/
  estados: any[] = [
    { valor: "1", etiqueta: "Activo" },
    { valor: "0", etiqueta: "Inactivo" }]

  displayedColumns: string[] = ['nombreUsuario', 'nombres'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('claveInput', { static: false }) claveInput!: ElementRef;
  @ViewChild('clave2Input', { static: false }) clave2Input!: ElementRef;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectUser = "";


  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      id: [""],
      nombre: ["",Validators.required],
      correo: ["",Validators.required],
      rol: ["",Validators.required],
      user: ["",Validators.required],
      estado: ["",Validators.required],
      clave: [""],
      clave2: [""]
    });
   }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit():void {
    if(this.validarNuevaClave()){
      this.guardarDatosUsuario()
    }else{
      this.alerta("Error","Las claves no coinciden","warning")
    }
  }

  mostrarContrasena():void {
    if (this.claveInput && this.clave2Input) {
      const tipoInput = this.claveInput.nativeElement.type === 'password' ? 'text' : 'password';
      this.claveInput.nativeElement.type = tipoInput;
      this.clave2Input.nativeElement.type = tipoInput;
    }
  }

  validarNuevaClave():boolean{
    const clave = this.claveInput.nativeElement.value;
    const clave2 = this.clave2Input.nativeElement.value;
    if (clave === '' && clave2 === '') {
      return true; // Ambas claves son vacías, devuelve true
    } else if (clave === clave2) {
      return true; // Las claves coinciden, devuelve true
    } else {
      return false; // Las claves no coinciden, devuelve false
    }
  }

  resetForm():void{
    this.selectUser = "[Nuevo Usuario]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
  }

  verUsuarioData(id:number):void{
    const usuario = this.data.find((item: { id: number; }) => item.id === id);

    if (usuario) {
      this.isFormVisible = true;
      this.selectUser = usuario.user
      this.registerForm.controls["id"].setValue(usuario.id)
      this.registerForm.controls["user"].setValue(usuario.user)
      this.registerForm.controls["nombre"].setValue(usuario.nombre)
      this.registerForm.controls["correo"].setValue(usuario.correo)
      this.registerForm.controls["rol"].setValue(usuario.rol)
      this.registerForm.controls["estado"].setValue(usuario.estado)
      this.registerForm.controls["clave"].setValue(usuario.clave)
      this.registerForm.controls["clave2"].setValue(usuario.clave2)
    } else {
      this.alerta("Error","No se encontro la información del usuario.","warning")
    }
  }

  guardarDatosUsuario(){
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
