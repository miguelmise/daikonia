import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planificador',
  templateUrl: './planificador.component.html',
  styleUrls: ['./planificador.component.css']
})
export class PlanificadorComponent implements OnInit {

  listaBeneficiados: any[] = [
    {
      id: 1,
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'JUEVES',
      nombre_beneficiado: 'Ciudadela Reeducativa Sembradores De Vida',
      numero_personas: 300,
      tipo_actividad: 'Comedor',
      edad_promedio_beneficiados: 25,
      alimento_requerido: 1500,
      generar:1
    },
    {
      id: 12,
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Fundación Puro Corazón',
      numero_personas: 111,
      tipo_actividad: 'Comedor',
      edad_promedio_beneficiados: 15,
      alimento_requerido: 800,
      generar:1
    },
    {
      id: 13,
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'LUNES',
      nombre_beneficiado: 'Fundación Caminando Juntos por el Cambio Sira Macias',
      numero_personas: 40,
      tipo_actividad: 'Entrega de Víveres',
      edad_promedio_beneficiados: 50,
      alimento_requerido: 220,
      generar:1
    },
    {
      id: 14,
      periodo_asignacion: 'QUINCENAL',
      dia_asignacion: 'MARTES',
      nombre_beneficiado: 'Iglesia del Nazareno Jesús La Esperanza',
      numero_personas: 15,
      tipo_actividad: 'Entrega de Víveres',
      edad_promedio_beneficiados: 32,
      alimento_requerido: 30,
      generar:1
    }
  ]

  
  selectedItems: Set<number> = new Set<number>();
  numBeneficiados: number = 0;
  numpersonas: number = 0;
  kgRequerido: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSelection(id: number) {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }

    this.numBeneficiados =  this.selectedItems.size;

    this.numpersonas = 0;
    this.kgRequerido = 0;

  for (const beneficiado of this.listaBeneficiados) {
    if (this.selectedItems.has(beneficiado.id)) {
      this.numpersonas += beneficiado.numero_personas;
      this.kgRequerido += beneficiado.alimento_requerido;
    }
  }

  }

  enviar() {
    // Lógica para enviar los IDs seleccionados
    console.log(Array.from(this.selectedItems));
  }

}
