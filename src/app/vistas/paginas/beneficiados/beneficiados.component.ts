import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficiados',
  templateUrl: './beneficiados.component.html',
  styleUrls: ['./beneficiados.component.css']
})
export class BeneficiadosComponent implements OnInit {

  listaBeneficiados: any[] = [
    {
      id: 1,
      tipo_asignacion: 'CUOTA',
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'JUEVES',
      nombre_beneficiado: 'Ciudadela Reeducativa Sembradores De Vida',
      numero_personas: 300,
      tipo_actividad: 'Comedor',
      edad_promedio_beneficiados: 25,
      tipo_alimento_restringido: null
    },
    {
      id: 2,
      tipo_asignacion: 'CUOTA/DESAYUNOS/KILOS DE AMOR',
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Fundación Puro Corazón',
      numero_personas: 111,
      tipo_actividad: 'Comedor',
      edad_promedio_beneficiados: 30,
      tipo_alimento_restringido: null
    },
    {
      id: 3,
      tipo_asignacion: 'CUOTA',
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Fundación Caminando Juntos por el Cambio Sira Macias',
      numero_personas: 1431,
      tipo_actividad: 'Entrega de Víveres',
      edad_promedio_beneficiados: 40,
      tipo_alimento_restringido: ['Lácteos', 'Alimentos fritos']
    },
    {
      id: 4,
      tipo_asignacion: 'CUOTA',
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Iglesia del Nazareno Jesús La Esperanza',
      numero_personas: 286,
      tipo_actividad: 'Entrega de Víveres',
      edad_promedio_beneficiados: 35,
      tipo_alimento_restringido: null
    },
    {
      id: 5,
      tipo_asignacion: 'CUOTA',
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Parroquia San Juan Bautista',
      numero_personas: 40,
      tipo_actividad: 'Entrega de Víveres',
      edad_promedio_beneficiados: 28,
      tipo_alimento_restringido: null
    },
    {
      id: 6,
      tipo_asignacion: 'CUOTA',
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Asociación de Mujeres Afroecuatorianas Eloy Alfaro',
      numero_personas: 307,
      tipo_actividad: 'Entrega de Víveres',
      edad_promedio_beneficiados: 32,
      tipo_alimento_restringido: null
    },
    {
      id: 7,
      tipo_asignacion: 'CUOTA',
      periodo_asignacion: 'SEMANAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Fundación "Unidos para Todos" 5 de Junio',
      numero_personas: 138,
      tipo_actividad: 'Refrigerios',
      edad_promedio_beneficiados: 38,
      tipo_alimento_restringido: ['Alimentos con alto contenido de azúcar']
    },
    {
      id: 8,
      tipo_asignacion: 'CUOTA',
      periodo_asignacion: 'QUINCENAL',
      dia_asignacion: 'VIERNES',
      nombre_beneficiado: 'Unidad Educativa Nuestra Madre de la Alborada',
      numero_personas: 21,
      tipo_actividad: 'Entrega de víveres',
      edad_promedio_beneficiados: 22,
      tipo_alimento_restringido: null
    }
  ];

  periocidad: any[] = [
    {valor: "SEMANAL", etiqueta: "Semanal"},
    {valor: "QUINCENAL", etiqueta: "Quincenal"},
    {valor: "MENSUAL", etiqueta: "Mensual"}
  ]

  dias: any[] = [
    {valor: "LUNES", etiqueta: "Lunes"},
    {valor: "MARTES", etiqueta: "Martes"},
    {valor: "MIERCOLES", etiqueta: "Miércoles"},
    {valor: "JUEVES", etiqueta: "Jueves"},
    {valor: "VIERNES", etiqueta: "Viernes"}
  ]

  displayedColumns: string[] = ['nombreBeneficiado', 'actividad'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectBeneficiado = "";
  

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder,private _util: UtilService) { 
    this.registerForm = this.formBuilder.group({
      id: [""],
      nombre_beneficiado: ["",Validators.required],
      tipo_actividad: ["",Validators.required],
      tipo_asignacion: ["",Validators.required],
      periodo_asignacion: ["",Validators.required],
      dia_asignacion: ["",Validators.required],
      numero_personas: ["",Validators.required],
      edad_promedio_beneficiados: ["",Validators.required],
      tipo_alimento_restringido: [""]
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.listaBeneficiados);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit():void {
    this.guardarDatosBeneficiado()
  }

  guardarDatosBeneficiado(){
    Swal.fire({
      title: 'Confirmación',
      text: 'Se guardará los cambios, ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
        this.submitted = true;
          if (this.registerForm.invalid) {
            return;
          }
          this._util.alerta("Data",JSON.stringify(this.registerForm.value),"info")
      }
    })
  }

  resetForm():void{
    this.selectBeneficiado = "[Nuevo Beneficiado]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
  }

  verBeneficiadoData(id:number):void{
    const beneficiado = this.listaBeneficiados.find((item: { id: number; }) => item.id === id);

    if (beneficiado) {
      this.isFormVisible = true;
      this.selectBeneficiado = beneficiado.nombre_beneficiado
      this.registerForm.controls["id"].setValue(beneficiado.id)
      this.registerForm.controls["nombre_beneficiado"].setValue(beneficiado.nombre_beneficiado)
      this.registerForm.controls["tipo_actividad"].setValue(beneficiado.tipo_actividad)
      this.registerForm.controls["tipo_asignacion"].setValue(beneficiado.tipo_asignacion)
      this.registerForm.controls["dia_asignacion"].setValue(beneficiado.dia_asignacion)
      this.registerForm.controls["periodo_asignacion"].setValue(beneficiado.periodo_asignacion)
      this.registerForm.controls["numero_personas"].setValue(beneficiado.numero_personas)
      this.registerForm.controls["edad_promedio_beneficiados"].setValue(beneficiado.edad_promedio_beneficiados)
      this.registerForm.controls["tipo_alimento_restringido"].setValue(beneficiado.tipo_alimento_restringido)
    } else {
      this._util.alerta("Error","No se encontro la información del Proveedor.","warning")
    }
  }

}
