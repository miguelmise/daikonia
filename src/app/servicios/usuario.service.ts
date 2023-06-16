import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  list_user(): Observable<any> {
    return this.http.get<any>(this.url + "usuario_ws.php",{});
  }

  buscar_user(data:any): Observable<any> {
    return this.http.get<any>(this.url + "usuario_ws.php",data);
  }

  update_User(data:any): Observable<any> {
    return this.http.put<any>(this.url + "usuario_ws.php",data);
  }

  create_User(data:any): Observable<any> {
    return this.http.post<any>(this.url + "usuario_ws.php",data);
  }

}
