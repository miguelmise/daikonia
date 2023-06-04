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
    this._login_service.login(this.registerForm.value)
    .pipe(
      finalize(() => {
        
      })
    )
    .subscribe({
      next: response => {
        // código a ejecutar cuando la operación Observable tenga éxito
        if(response.user != ""){
          this.router.navigate(['principal']);
        }else{
          this._util.alerta("Error","Usuario o Clave Incorrectos","error")
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
