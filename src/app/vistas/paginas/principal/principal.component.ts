import { Component, OnInit, HostListener  } from '@angular/core';
//import $ from 'jquery';
import "../../../../assets/js/home.js";
import "../../../../assets/js/jqmin.js";
import "../../../../assets/js/jquerymin.js";
import "../../../../assets/js/bundle.js";
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  isCollapsed = true;

  //Paginas
  Paginas: { [key: string]: boolean } = {
    Inicio: true,
    Usuarios: false,
    Proveedores: false,
    Beneficiados: false,
    Productos: false,
    Inventario: false
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

  constructor(private router: Router,private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Kairo');
  }
  

  mostrarPagina(pagina: string): void {
    for (const key in this.Paginas) {
      if (key === pagina) {
        this.Paginas[key] = true;
      } else {
        this.Paginas[key] = false;
      }
    }
  }

  salir(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Se cerrará la sesión?',
      showCancelButton:true,
      toast:true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d21e2a'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['login']);
      } else if (result.isDenied) {
      }
    })
  }

}
