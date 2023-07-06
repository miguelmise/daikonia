import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  listar_productos():Observable<any>{
    return this.http.get<any>(this.url + "producto_ws.php",{});
  }

  actualizar_producto(data:any):Observable<any>{
    return this.http.put<any>(this.url + "producto_ws.php",data);
  }

  nuevo_producto(data:any):Observable<any>{
    return this.http.post<any>(this.url + "producto_ws.php",data);
  }

}
