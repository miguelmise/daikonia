import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import "../../../../assets/js/home.js";
import "../../../../assets/js/jqmin.js";
import "../../../../assets/js/jquerymin.js";
import "../../../../assets/js/bundle.js";
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  isCollapsed = true;

  //Paginas
  showInicio: boolean = true;
  showUsuarios: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

  mostrarInicio(): void {
    this.showInicio = true;
    this.showUsuarios = false;
  }

  mostrarUsuarios(): void {
    this.showInicio = false;
    this.showUsuarios = true;
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
