import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  data: any[] = [];
  update_user = true;

  data1 : any = [
    {id : 1,user : 'admin', nombre : 'Administrador', correo : 'admin@dk.com', rol : 'admin', estado: 1},
    {id : 2,user : 'sintriago', nombre : 'Sandy Intriago', correo : 'sintrig@dk.com', rol : 'user', estado: 1}]

  /* tipos de rol - esta lista deberia cargarse usando un servicio que verifique los roles existentes*/
  roles: any[] = [
    { valor: 1, etiqueta: "Administrador" },
    { valor: 2, etiqueta: "Planificador" },
    { valor: 3, etiqueta: "Usuario" }]

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


  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private _util: UtilService,
    private _usuario: UsuarioService) {
    this.registerForm = this.formBuilder.group({
      user_id: [""],
      user_nombres: ["",Validators.required],
      user_correo: ["",[Validators.required, Validators.email]],
      user_rol: ["",Validators.required],
      user_nick: ["",Validators.required],
      user_estado: ["",Validators.required],
      user_clave: [""],
      clave2: [""]
    });
   }

  ngOnInit(): void {
    
    this.cargarListaUsuarios()
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit():void {
    if(this.validarNuevaClave()){
      this.guardarDatosUsuario()
    }else{
      this._util.alerta("Error","Las claves no coinciden","warning")
    }
  }

  cargarListaUsuarios():void{
    this._usuario.list_user().subscribe(
      (result) => {
        this.data = result
        this.dataSource = new MatTableDataSource(this.data);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      },
      (error) => {
        this._util.alerta("Error",JSON.stringify(error),"warning")
      }
    );
    
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
    this.update_user = false;
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
  }

  verUsuarioData(id:number):void{
    this.update_user = true;
    const usuario = this.data.find((item: { user_id: number; }) => item.user_id == id);

    if (usuario) {
      this.isFormVisible = true;
      this.selectUser = usuario.user
      this.registerForm.controls["user_id"].setValue(usuario.user_id)
      this.registerForm.controls["user_nick"].setValue(usuario.user_nick)
      this.registerForm.controls["user_nombres"].setValue(usuario.user_nombres)
      this.registerForm.controls["user_correo"].setValue(usuario.user_correo)
      this.registerForm.controls["user_rol"].setValue(usuario.user_rol)
      this.registerForm.controls["user_estado"].setValue(usuario.user_estado)
      this.registerForm.controls["user_clave"].setValue(usuario.clave)
      this.registerForm.controls["clave2"].setValue(usuario.clave2)
    } else {
      this._util.alerta("Error","No se encontro la información del usuario.","warning")
    }
    
  }

  existeNick():boolean{
    var nick = this.registerForm.controls["user_nick"].value
    const usuario_nick = this.data.find((item: { user_nick: Text; }) => item.user_nick == nick) ?? null;
    if(usuario_nick != null){
      return true;
    }else{
      return false;
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
          if(this.update_user){
            this._usuario.update_User(this.registerForm.value)
            .subscribe({
              next: response =>{
                this._util.alerta("Procesado",JSON.stringify(response.mensaje),"info")
                this.cargarListaUsuarios()
              }, error : e => this._util.alerta("Error",JSON.stringify(e),"error")
            })
          }else{
            if(this.existeNick()){this._util.alerta("Error","Ya existe el nombre de usuario","warning"); return;}
              this._usuario.create_User(this.registerForm.value)
              .subscribe({
                next: response =>{
                  this._util.alerta("Procesado",JSON.stringify(response.mensaje),"info")
                  this.cargarListaUsuarios()
                },error: e => this._util.alerta("Error",JSON.stringify(e),"error")
              })
          }
          
      }
    })
  }


}
