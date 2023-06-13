import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  alerta(titulo:string,contenido:string,icono:any){
    Swal.fire({
      title:titulo,
      text:contenido,
      toast:true,
      icon:icono,
      confirmButtonColor: '#006e8c'
    })
  }

  getToken(): string {
    return sessionStorage.getItem('token') ?? '';
  }

  setToken(token:any):void{
    sessionStorage.setItem('token', token);
  }

  removeToken():void{
    sessionStorage.removeItem('token');
  }

  setPagina(pagina:any):void{
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (3 * 60 * 60 * 1000)); // 3 horas en milisegundos
    const expires = expirationDate.toUTCString();

    document.cookie = `_page=${pagina}; expires=${expires}; path=/`;
  }

  getUserName():string{
    var token:any = JSON.parse(atob(sessionStorage.getItem('token') ?? ''));
    return token.nombres;
  }

  getPagina():string{
    const cookiePagina = document.cookie.replace(/(?:(?:^|.*;\s*)_page\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return cookiePagina || "404";
  }

  deleteCookie(name: string): void {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  
}

