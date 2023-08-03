
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';
import {ReportesService} from 'src/app/servicios/reportes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-ordenes-reporte',
  templateUrl: './ordenes-reporte.component.html',
  styleUrls: ['./ordenes-reporte.component.css']
})
export class OrdenesReporteComponent implements OnInit {
  registerForm: FormGroup;
  result: any[] = [];
  listaOrdenes: any[] = [];

  ordenAlimentos: any[] = [];

  displayedColumns: string[] = ['orden_beneficiado_nombre', 'orden_producto_ubicacion','orden_producto_caducidad','orden_producto_codigo','orden_producto_descripcion',
                                  'orden_proveedor_nombre','orden_producto_precio','orden_producto_cantidad','orden_fecha_emision'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private _util : UtilService, 
              private cdr: ChangeDetectorRef, 
              private _reporte:ReportesService,
              private formBuilder: FormBuilder) { 
    
    this.registerForm = this.formBuilder.group({
      codigo_producto: [""],
      proveedor: [""],
      beneficiario: [""],
      fecha_inicio:null,
      fecha_fin:null
    });
  }

  ngOnInit(): void {
    //this.cargarListaOrdenes();
    this.cargarOrdenes();
    
    
  }
  buscarOrdenes(){
    this.result=this.listaOrdenes;
    console.log(this.registerForm.value)
    if(this.registerForm.get('codigo_producto')?.value 
        || this.registerForm.get('proveedor')?.value 
        || this.registerForm.get('beneficiario')?.value
        || this.registerForm.get('fecha_inicio')?.value 
        || this.registerForm.get('fecha_fin')?.value ){

        if(this.registerForm.get('fecha_inicio')?.value || this.registerForm.get('fecha_fin')?.value ){
          var fechaInicio = new Date(new Date(this.registerForm.get('fecha_inicio')?.value).setHours(0, 0, 0, 0));
          fechaInicio=new Date(fechaInicio.setDate(fechaInicio.getDate()+1));
          var fechaFin = new Date(this.registerForm.get('fecha_fin')?.value);
          fechaFin=new Date(new Date(fechaFin.setDate(fechaFin.getDate()+1)).setHours(23, 59, 59, 999));
          //console.log("fecha inicio:"+fechaInicio);
          //console.log("fecha fin "+fechaFin)
          if(this.registerForm.get('fecha_inicio')?.value){
            this.result = this.result.filter((obj) => {
              var fechaOrden= new Date(obj.orden_fecha_emision);
              //console.log("orde: "+fechaOrden+"inicio "+ new Date(new Date(this.registerForm.get('fecha_inicio')?.value)).getDate()+1);
              return fechaOrden>= fechaInicio;
            });
            
          }

          if(this.registerForm.get('fecha_fin')?.value){
            this.result = this.result.filter((obj) => {
              var fechaOrden= new Date(obj.orden_fecha_emision)
              return fechaFin >= fechaOrden;
            });
          }
          
          
        } 
      
      if(this.registerForm.get('codigo_producto')?.value ){
        this.result = this.result.filter((obj) => {
          return obj.orden_producto_codigo.toString() === this.registerForm.get('codigo_producto')?.value;
        });
      }
      if(this.registerForm.get('proveedor')?.value ){
        this.result = this.result.filter((obj) => {
          return String(obj.orden_proveedor_nombre).toUpperCase().replace(" ", "").includes(this.registerForm.get('proveedor')?.value.toUpperCase().replace(" ", ""));
        });
      }
      if(this.registerForm.get('beneficiario')?.value ){
        this.result = this.result.filter((obj) => {
          return String(obj.orden_beneficiado_nombre).toUpperCase().replace(" ", "").includes(this.registerForm.get('beneficiario')?.value.toUpperCase().replace(" ", ""));
        });
      }  

    }else{
      //this.result=[];
      if(!this.registerForm.get('codigo_producto')?.value 
        || !this.registerForm.get('proveedor')?.value 
        || !this.registerForm.get('beneficiario')?.value){
      Swal.fire({
        title: '',
        text: 'No se aplicó ningun filtro, por lo que se mostrará la información de todas las ordenes generadas',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'ok',
        confirmButtonColor: '#1cc88a',
        toast:true
      }).then((result)=>{
        if(result.value){
          //this.result=[];
        }
        
      })
    }
    }
    
    this.ordenAlimentos=this.result;
    this.dataSource=new MatTableDataSource(this.ordenAlimentos);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //console.log(this.registerForm.get('codigo_producto')?.value);
    ///.log("Resultado filtro");
    ///console.log(this.ordenAlimentos);
  }
  cargarOrdenes():void{
    this._reporte.listado_ordenes().subscribe({
      next:res=>{
        this.listaOrdenes = res;
        //this.ordenAlimentos=res;
        this.dataSource = new MatTableDataSource(this.listaOrdenes);
        //console.log(this.listaOrdenes);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },error:err=>{
        if(err.error){
          this._util.alerta_error(err.error)
        }else{
          this._util.alerta_error(JSON.stringify(err))
        }
      }
    })
  }
  
}
