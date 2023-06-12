import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url : string = "http://172.23.145.214/kairo/back/api/";

  constructor(private http:HttpClient) { }

  list_user(): Observable<any> {
    return this.http.post<any>(this.url + "user_list.php",{});
  }

  buscar_user(data:any): Observable<any> {
    return this.http.post<any>(this.url + "user_buscar.php",data);
  }

  update_User(data:any): Observable<any> {
    return this.http.post<any>(this.url + "user_update.php",data);
  }

  create_User(data:any): Observable<any> {
    return this.http.post<any>(this.url + "user_create.php",data);
  }

}
