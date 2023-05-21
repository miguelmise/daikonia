import { Component, OnInit } from '@angular/core';
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
  showInicio: boolean = true;
  showUsuarios: boolean = false;
  showDonantes: boolean = false;
  showBeneficiados: boolean = false;

  constructor(private router: Router,private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Diakonia');
  }

  mostrarInicio(): void {
    this.showInicio = true;
    this.showUsuarios = false;
    this.showDonantes = false;
    this.showBeneficiados = false;
  }

  mostrarUsuarios(): void {
    this.showInicio = false;
    this.showUsuarios = true;
    this.showDonantes = false;
    this.showBeneficiados = false;
  }

  mostrarDonantes(): void {
    this.showInicio = false;
    this.showUsuarios = false;
    this.showDonantes = true;
    this.showBeneficiados = false;
  }

  mostrarBeneficiados(): void {
    this.showInicio = false;
    this.showUsuarios = false;
    this.showDonantes = false;
    this.showBeneficiados = true;
  }

  salir(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Se cerrará la sesión?',
      showCancelButton:true,
      toast:true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['login']);
      } else if (result.isDenied) {
      }
    })
  }

}
