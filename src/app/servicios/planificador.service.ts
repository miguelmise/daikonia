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
    const params = new HttpParams().set('parametro', 'productos');
    return this.http.get<any>(this.url + "planificador_ws.php",{params});
  }

  listar_beneficiados():Observable<any>{
    const params = new HttpParams().set('parametro', 'beneficiados');
    return this.http.get<any>(this.url + "planificador_ws.php",{params});
  }

  listar_existencias():Observable<any>{
    const params = new HttpParams().set('parametro', 'existencias');
    return this.http.get<any>(this.url + "planificador_ws.php",{params});
  }

  listar_ordenes():Observable<any>{
    const params = new HttpParams().set('parametro', 'ordenes');
    return this.http.get<any>(this.url + "planificador_ws.php",{params});
  }

  generarOrdenAlimentos(data:any):Observable<any>{
    return this.http.post<any>(this.url + "planificador_ws.php",data);
  }

  repartirProductos(data:any):Observable<any>{
    return this.http.post<any>(this.url + "repartidor_ws.php",data);
  }

  obtener_orden(data:any):Observable<any>{
    const params = new HttpParams().set('parametro', data);
    return this.http.get<any>(this.url + "planificador_ws.php",{params});
  }

  cancelar_orden():Observable<any>{
    return this.http.put<any>(this.url + "planificador_ws.php",null,{});
  }

  confirmarOrden(data:any):Observable<any>{
    const params = new HttpParams().set('parametro', data);
    return this.http.put<any>(this.url + "planificador_ws.php",null,{params});
  }

}
