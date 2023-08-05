
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
  accionActiva:boolean=false;
  result: any[] = [];
  listaOrdenes: any[] = [];

  ordenAlimentos: any[] = [];

  displayedColumns: string[] = ['orden_beneficiado_nombre', 'orden_producto_ubicacion','orden_producto_caducidad','orden_producto_codigo','cat_pro_nombre','orden_producto_descripcion',
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
      codigo_producto: null,
      proveedor: null,
      beneficiario: null,
      fecha_inicio:null,
      fecha_fin:null,
      reporte:"ordenes"
    });
  }

  ngOnInit(): void {

    
  }
  buscarOrdenes(){
    //this.result=this.listaOrdenes;
    this.accionActiva=true;
    if(this.registerForm.get('codigo_producto')?.value 
        || this.registerForm.get('proveedor')?.value 
        || this.registerForm.get('beneficiario')?.value
        || this.registerForm.get('fecha_inicio')?.value 
        || this.registerForm.get('fecha_fin')?.value ){
    
      this._reporte.buscar_orden(this.registerForm.value).subscribe({
        next:(res:any[])=>{
          //this.listaOrdenes = res;
          this.ordenAlimentos=res;
          this.result=this.listaOrdenes;
          this.dataSource = new MatTableDataSource(this.ordenAlimentos);
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
        
    }else{
     
      if(!this.registerForm.get('codigo_producto')?.value 
        || !this.registerForm.get('proveedor')?.value 
        || !this.registerForm.get('beneficiario')?.value
        ){
      Swal.fire({
        title: '',
        text: 'No se aplicó ningun filtro',
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
    
  }
  
  
}
