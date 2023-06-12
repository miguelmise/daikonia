import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/servicios/seguridad/login.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
//import { of } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mensaje_fail_login = 'Error al iniciar sesión';
  invalido = "Usuario o clave incorrectos";
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _login_service : LoginService,
    private titleService: Title,
    private _util: UtilService
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
    this.titleService.setTitle('Kairo Login');
  }

  onSubmit():void {
    this._login_service.login_user(this.registerForm.value)
    .pipe(
      finalize(() => {
        
      })
    )
    .subscribe({
      next: response => {
        var token:any = JSON.parse(atob(response.token));

        if(token.error!=null){
          this._util.alerta(this.mensaje_fail_login,token.error,"info")
          this._util.removeToken()
        }else{
          this._util.setToken(response.token)
          this._util.setPagina("Inicio")
          this.router.navigate(['/principal'])
        }
        
        
      },
      error: e => {
        this._util.alerta("Error",JSON.stringify(e),"error")
      }
    });
    
  }

  recuperarPassword():void {
    this._util.alerta("No disponible","Contacte al administrador del sistema","warning")
  }


}
