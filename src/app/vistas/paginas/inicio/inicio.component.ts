import { Component, OnInit, ElementRef  } from '@angular/core';
import { PlanificadorService } from 'src/app/servicios/planificador.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import { ChartOptions, ChartType,ChartData, Chart,Legend  } from 'chart.js';
import { finalize } from 'rxjs';
import { StockItem } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  lista_stock: any[] = []
  productNames :any
  productQuantities  :any
  chartType: ChartType = 'bar';
  chart: any;
  

  constructor(private _planificador: PlanificadorService, private _util: UtilService,private elementRef: ElementRef) { }

  ngOnInit(): void {
    //this.cargarListaStock()
  }

  ngAfterViewInit(){
    this.cargarListaStock()
  }


  cargarListaStock(): void {
    this._planificador.listar_existencias()
      .pipe(finalize(() => {
        // Extraer los nombres de los productos y las cantidades
        this.productNames = [];
        this.productQuantities = [];

        this.lista_stock.forEach((item: StockItem) => {
          this.productNames.push(item.cat_pro_nombre + "(kg)");
          this.productQuantities.push(parseFloat(item.suma) / 1000);
        });
        
        this.crearGrafico();
      }))
      .subscribe({
        next: (res: StockItem[]) => {
          this.lista_stock = res;
  
          
        },
        error: (err: any) => {
          this._util.alerta_error(JSON.stringify(err));
        }
      });
  }
  

  crearGrafico(){
  
    const ctx = this.elementRef.nativeElement.querySelector('#stockChart');

    const randomColors = this.generateRandomColors(this.productNames.length);

    this.chart =new Chart(ctx, {
      type: this.chartType,
      data: {
        labels: this.productNames,
        datasets: [{
          data: this.productQuantities,
          backgroundColor: randomColors,
          borderColor: randomColors,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        aspectRatio: 0.8,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: false, // Evita que los ticks se omitan automáticamente
              maxRotation: 0, // Establece la rotación del label x en 0 grados para evitar superposiciones
              minRotation: 0
            }
          },
          y: {
            ticks: {
              autoSkip: false, // Evita que los ticks se omitan automáticamente
            }
          }
        },
        plugins:{
          legend: {
            position: 'left',
            display: false 
          },title: {
            display: true,
            text: '  Productos por Categoría ',
            position: 'top',
          }
        }
      },
    });

}

generateRandomColors(numColors: number): string[] {
  const randomColors: string[] = [];
  const letters = '0123456789ABCDEF';

  for (let i = 0; i < numColors; i++) {
    let color = '#';
    for (let j = 0; j < 6; j++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    randomColors.push(color);
  }

  return randomColors;
}



}
