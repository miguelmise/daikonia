import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  listar_inventario():Observable<any>{
    return this.http.get<any>(this.url + "carga_inventario_ws.php",{});
  }

  devolver_producto(data:any):Observable<any>{
    return this.http.post<any>(this.url + "reportes_ws.php",data);
  }

  cargarArchivoInventario(data:any):Observable<any>{
    return this.http.post<any>(this.url + "carga_inventario_ws.php",data);
  }

  actualizar_Inventario(data:any):Observable<any>{
    return this.http.put<any>(this.url + "carga_inventario_ws.php",data);
  }

}
