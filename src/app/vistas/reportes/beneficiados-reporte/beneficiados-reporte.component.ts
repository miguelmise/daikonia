import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ChartType } from 'chart.js';
import { finalize } from 'rxjs';
import { ReportesService } from 'src/app/servicios/reportes.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';

@Component({
  selector: 'app-beneficiados-reporte',
  templateUrl: './beneficiados-reporte.component.html',
  styleUrls: ['./beneficiados-reporte.component.css']
})
export class BeneficiadosReporteComponent implements OnInit {

  dataBeneficiados: any[] = [];

  registerForm: FormGroup;

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  displayedColumns: string[] = ['beneficiado', 'peso', 'precio'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  submitted = false;

  beneficiadosLabel : any
  productosLabel : any
  productosKg : any
  productosPrecio : any
  chartType : ChartType = 'bar';
  chart : any;

  constructor(private formBuilder: FormBuilder,private _util: UtilService, private _reporte: ReportesService,private cdr: ChangeDetectorRef,private elementRef: ElementRef) {
    this.registerForm = this.formBuilder.group({
      fecha_inicio:["",Validators.required],
      fecha_fin:["",Validators.required],
      reporte:"beneficiados"
    });
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.recargarGrafico()
  }

  recargarGrafico(){
    document.getElementById('BeneficiadosChart')?.remove()
    var canvas = document.createElement("canvas");
    canvas.id = "BeneficiadosChart"; 
    document.getElementById("contenedor")?.appendChild(canvas);
    this.cargarDatos()
  }

  cargarDatos():void{
    this._reporte.buscar_orden(this.registerForm.value)
    .pipe(finalize(() => {
      this.beneficiadosLabel = [];
        this.productosKg = [];
        this.productosPrecio = []

        this.dataBeneficiados.forEach((item: any) => {
          this.beneficiadosLabel.push(item.orden_beneficiado_nombre)
          this.productosPrecio.push(item.precio)
          this.productosKg.push(parseFloat(item.peso) / 1000);
        });
        
        this.crearGrafico();
    }))
    .subscribe({
      next:(res:any[])=>{
        this.dataBeneficiados = res
        this.dataSource = new MatTableDataSource(this.dataBeneficiados);
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

  crearGrafico(){
  
    const ctx = this.elementRef.nativeElement.querySelector('#BeneficiadosChart');

    this.chart =new Chart(ctx, {
      type: this.chartType,
      data: {
        labels: this.beneficiadosLabel,
        datasets: [{
          label: 'Peso Kg',
          data: this.productosKg,
          backgroundColor: '#FF8000',
          borderColor: '#FF8000',
          borderWidth: 1
        },
        {
          label: 'Valor $',
          data: this.productosPrecio,
          backgroundColor: '#00cc66',
          borderColor: '#00cc66',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        aspectRatio: 0.9,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: true, // Evita que los ticks se omitan automáticamente
              maxRotation: 0, // Establece la rotación del label x en 0 grados para evitar superposiciones
              minRotation: 0
            }
          },
          y: {
            ticks: {
              autoSkip: true, // Evita que los ticks se omitan automáticamente
            }
          }
        },
        plugins:{
          legend: {
            position: 'top',
            display: true 
          },title: {
            display: true,
            text: '  Productos Kg entregados a beneficiados ',
            position: 'top',
          }
        }
      },
    });

}

}
