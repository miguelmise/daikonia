import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


interface respuesta_login{
  user: String,
  rol: String,
  nombre: String,
  mensaje : String
}

interface LoginResponse {
  username: string;
  rol: string;
  nombres: string;
  exp: number;
  ip: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  respuesta!: respuesta_login;
  //url : string = "https://diakoniaweb.000webhostapp.com/kairo/back/api/";
  url : string = "http://172.22.28.254/kairo/back/api/";
  //url = environment.apiUrl;

  constructor(private http:HttpClient) { 
  }

  /**Retorna el token de acceso */
  login_user(data: any): Observable<any> {
    return this.http.post<any>(this.url + "user_login.php", data);
  }

  /**Servicio de prueba */
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
