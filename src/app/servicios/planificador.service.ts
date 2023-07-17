import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanificadorService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  listar_productos_invalidos():Observable<any>{
    return this.http.get<any>(this.url + "planificador_ws.php",{});
  }
}
