import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficiadosService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  listar_beneficiados(): Observable<any>{
    return this.http.get<any>(this.url + "beneficiado_ws.php",{});
  }

  buscar_beneficiado(data:any): Observable<any>{
    return this.http.get<any>(this.url + "beneficiado_ws.php",data);
  }

  update_beneficiado(data:any): Observable<any> {
    return this.http.put<any>(this.url + "beneficiado_update_ws.php",data);
  }

  create_beneficiado(data:any): Observable<any> {
    return this.http.post<any>(this.url + "beneficiado_create_ws.php",data);
  }

}
