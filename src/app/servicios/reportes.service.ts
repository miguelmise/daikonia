import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  listado_ordenes():Observable<any>{
    return this.http.get<any>(this.url + "reportes_ws.php");
  }

  buscar_orden(data:any):Observable<any>{
    return this.http.put<any>(this.url + "reportes_ws.php",data);
  }
}
