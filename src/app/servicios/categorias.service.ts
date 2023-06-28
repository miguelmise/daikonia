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

  listar_categorias_persona_beneficiado(beneficiado_id: number): Observable<any> {
    const params = new HttpParams().set('beneficiado_id', beneficiado_id.toString());
    return this.http.get<any>(this.url + "cat_per_beneficiado_ws.php", { params });
  }

}
