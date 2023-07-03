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

  listar_categorias_personas():Observable<any>{
    return this.http.get<any>(this.url+"categoria_persona_ws.php",{});
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
