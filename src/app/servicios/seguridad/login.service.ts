import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

interface respuesta_login{
  user: String,
  rol: String,
  nombre: String,
  mensaje : String
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  respuesta!: respuesta_login;

  constructor(private http:HttpClient) { 
  }

  login(data:any): Observable<respuesta_login> {
    if(data.username == "admin" && data.password == "admin") {
      const respuesta: respuesta_login = {
        user: data.username,
        rol: 'admin',
        nombre: 'Administrador',
        mensaje: 'Bienvenido al sistema'
      };
      return of(respuesta);
    }else{
      const respuesta: respuesta_login = {
        user: '',
        rol: '',
        nombre: '',
        mensaje: 'Usuario o clave Incorrectos'
      };
    }
    return throwError('Usuario o clave incorrectos');
  }

}
