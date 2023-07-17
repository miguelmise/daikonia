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
    Categoria:false
  };

  private collapseIds = ['collapseProcesos', 'collapseInventary','collapseEntidades','collapseUsuarios'];

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
    private _util: UtilService, private _usuario: UsuarioService, private _planificador: PlanificadorService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Kairo');
    this.mostrarPagina(this._util.getPagina())
    this.NombreUsuario = this._util.getUserName()
    this.cargarAlertasProductos()
    
  }

  irAlProducto(id:number):void{
    this._util.setProducto(id)
    this.mostrarPagina("Productos")
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

  mostrarPagina(pagina: string): void {
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
        '<p>Versión: 1.0</p>' +
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
