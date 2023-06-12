import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../servicios/utilidades/util.service';

@Injectable({
  providedIn: 'root'
})
export class AccesoGuard implements CanActivate {

  constructor(private router:Router, private _util: UtilService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.redireccionar(this._util.getToken())
    return true;
  }

  redireccionar(token:any){
    if(token == ""){
      this.router.navigate(['/login'])
      this._util.alerta("Error","Sesión Expirada","error")
    }
  }

  
}
