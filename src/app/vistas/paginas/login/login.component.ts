import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/servicios/seguridad/login.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalido = "Usuario o clave incorrectos";
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _login_service : LoginService
    ) { 
    this.registerForm = this.formBuilder.group({
      username: ["",Validators.required],
      password: ["",Validators.required]
  });
   }

   get form(){
    return this.registerForm.controls;
  }

  ngOnInit(): void {
  }

  onSubmit():void {
    this._login_service.login(this.registerForm.value)
    .pipe(
      finalize(() => {
        
      })
    )
    .subscribe({
      next: response => {
        // código a ejecutar cuando la operación Observable tenga éxito
        if(response.user != ""){
          this.router.navigate(['home']);
        }else{
          this.alerta("Error","Usuario o Clave Incorrectos","error")
        }
      },
      error: e => {
        this.alerta("Error",JSON.stringify(e),"error")
      }
    });
    
  }

  recuperarPassword():void {
    this.alerta("No disponible","Contacte al administrador del sistema","warning")
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
