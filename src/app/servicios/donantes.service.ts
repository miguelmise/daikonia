import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonantesService {

  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  listar_donantes(): Observable<any> {
    return this.http.get<any>(this.url + "donante_ws.php",{});
  }

  buscar_donante(data:any): Observable<any> {
    return this.http.get<any>(this.url + "donante_ws.php",data);
  }

  update_donante(data:any): Observable<any> {
    return this.http.put<any>(this.url + "donante_ws.php",data);
  }

  create_donante(data:any): Observable<any> {
    return this.http.post<any>(this.url + "donante_ws.php",data);
  }

}
