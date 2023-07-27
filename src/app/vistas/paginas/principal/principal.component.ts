import { Component, OnInit, HostListener  } from '@angular/core';
//import $ from 'jquery';
import "../../../../assets/js/home.js";
import "../../../../assets/js/jqmin.js";
import "../../../../assets/js/jquerymin.js";
import "../../../../assets/js/bundle.js";
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { PlanificadorService } from 'src/app/servicios/planificador.service';
import { LoginService } from 'src/app/servicios/seguridad/login.service';
import { inArray } from 'jquery';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  isCollapsed = true;
  NombreUsuario = "";
  lista_productos_invalidos:any[] = []; 


  //Paginas
  Paginas: { [key: string]: boolean } = {
    Inicio: false,
    Usuarios: false,
    Proveedores: false,
    Beneficiados: false,
    Productos: false,
    Inventario: false,
    Reglas: false,
    Planificador: false,
    Categoria:false,
    Ordenes:false,
    No_Autorizado:false
  };

  private collapseIds = ['collapseProcesos', 'collapseInventary','collapseEntidades','collapseUsuarios','collapseOrdenes'];

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    for (const collapseId of this.collapseIds) {
      const collapseElement = document.getElementById(collapseId);
      const isClickInside = collapseElement?.contains(target);

      if (collapseElement && !isClickInside) {
        collapseElement.classList.remove("show");
      }
    }
  }

  constructor(private router: Router,
    private titleService: Title,
    private _util: UtilService, private _usuario: UsuarioService, private _planificador: PlanificadorService, private _login : LoginService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Kairo');
    this.mostrarPagina(this._util.getPagina())
    this.NombreUsuario = this._util.getUserName()
    this.cargarAlertasProductos()
    
  }
  
  mostrarPagina(pagina: string):void{
    var token = this._util.getToken()
    this._login.verificar(token).subscribe({
      next:res=>{
        if(res.acceso != 1){
          this.router.navigate(['login']);
          this._util.alerta_error("Sesión Expirada")
          return
        }

        if(pagina == "Inicio"){
          this.setPagina(pagina)
          return
        }

        if(res.paginas.indexOf(pagina) !== -1){
          this.setPagina(pagina)
          this._util.setToken(res.token)
        }else{
          this.setPagina("No_Autorizado")
        }
        
      },error:err=>{
        console.log(err)
      }
    })
  }
  
  
  cargarAlertasProductos():void{
    this._planificador.listar_productos_invalidos().subscribe({
      next:res=>{
        this.lista_productos_invalidos = res
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }

  setPagina(pagina: string): void {
    this._util.setPagina(pagina)
    for (const key in this.Paginas) {
      if (key == pagina) {
        this.Paginas[key] = true;
      } else {
        this.Paginas[key] = false;
      }
    }
  }

  acercaDe():void{
    Swal.fire({
      title: '<strong>Acerca de Kairo</strong>',
      html:
        '<p>Versión: 1.0 beta</p>' +
        '<p>Desarrolladores:</p>' +
        '<p>Miguel Angel Mise</p>' +
        '<p>Sandy Intriago</p>' +
        '<p>Tecnologías utilizadas:</p>' +
        '<p>Angular, PHP y MySQL</p>' +
        '<p>Licencia:</p>' +
        '<p>Kairo se distribuye bajo la licencia GNU General Public License (GPL) versión 3. Esta licencia garantiza la libertad de uso, modificación y distribución del software.</p>' +
        '<p>© 2023 Miguel Angel Mise y Sandy Intriago. Todos los derechos reservados.</p>',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> ¡Genial!',
      confirmButtonColor: '#006e8c',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
    });
    
  }

  salir(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Se cerrará la sesión?',
      showCancelButton:true,
      toast:true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#36b9cc'
    }).then((result) => {
      if (result.isConfirmed) {
        this._util.deleteCookie('_page');
        this._util.removeToken();
        this.router.navigate(['login']);
      } else if (result.isDenied) {
      }
    })
  }

}
