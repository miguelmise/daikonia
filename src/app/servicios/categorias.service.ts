import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  
  listar_categorias_productos():Observable<any>{
    return this.http.get<any>(this.url + "categoria_producto_ws.php",{});
  }

  actualizar_categoria_producto(data:any):Observable<any>{
    return this.http.put<any>(this.url + "categoria_producto_ws.php",data);
  }

  nuevo_categoria_producto(data:any):Observable<any>{
    return this.http.post<any>(this.url + "categoria_producto_ws.php",data);
  }

  listar_categorias_personas():Observable<any>{
    return this.http.get<any>(this.url+"categoria_persona2_ws.php",{});
  }

  nuevo_categoria_persona(data:any):Observable<any>{
    return this.http.post<any>(this.url + "categoria_persona2_ws.php",data);
  }

  actualizar_categoria_persona(data:any):Observable<any>{
    return this.http.put<any>(this.url + "categoria_persona2_ws.php",data);
  }

  listar_categorias_persona_beneficiado(beneficiado_id: number): Observable<any> {
    const params = new HttpParams().set('beneficiado_id', beneficiado_id.toString());
    return this.http.get<any>(this.url + "cat_per_beneficiado_ws.php", { params });
  }

  crear_categoria_persona_beneficiado(data:any):Observable<any>{
    return this.http.post<any>(this.url + "categ_pers_benef_create_ws.php",data);
  }

  actualizar_categoria_persona_beneficiado(data:any):Observable<any>{
    return this.http.put<any>(this.url+"categ_pers_benef_update_ws.php",data);
  }



}
