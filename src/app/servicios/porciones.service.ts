import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PorcionesService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  listar_por_id_categoria(id:number):Observable<any>{
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<any>(this.url + "porciones_ws.php",{params});
  }

  actualizarCantidad(id: number, valor: number): Observable<any> {
    let params = new HttpParams().set('id', id.toString()).set('cantidad', valor.toString());
  
    return this.http.put<any>(this.url + 'porciones_ws.php', null, { params });
  }

  eliminar(id: number): Observable<any> {
    let params = new HttpParams().set('id', id.toString());
  
    return this.http.delete<any>(this.url + 'porciones_ws.php',{ params });
  }

  crearNuevo(id_persona: number,id_producto: number, valor: number):Observable<any>{
    let params = new HttpParams().set('id_persona', id_persona.toString()).set('id_producto', id_producto.toString()).set('cantidad', valor.toString());
    return this.http.post<any>(this.url + "porciones_ws.php",null,{params});
  }

}
