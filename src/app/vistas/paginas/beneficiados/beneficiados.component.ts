import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BeneficiadosService } from 'src/app/servicios/beneficiados.service';
import { CategoriasService } from 'src/app/servicios/categorias.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficiados',
  templateUrl: './beneficiados.component.html',
  styleUrls: ['./beneficiados.component.css']
})
export class BeneficiadosComponent implements OnInit {

  listaBeneficiados: any[] = [];

  listaCatPersonas: any[] = [];

  periocidad: any[] = [
    {valor: 7, etiqueta: "Semanal"},
    {valor: 15, etiqueta: "Quincenal"},
    {valor: 30, etiqueta: "Mensual"},
    {valor: 1, etiqueta: "Diario"},
    {valor: 90, etiqueta: "Trimestral"}
  ]

  dias: any[] = [
    {valor: "Monday", etiqueta: "Lunes"},
    {valor: "Tuesday", etiqueta: "Martes"},
    {valor: "Wednesday", etiqueta: "Miércoles"},
    {valor: "Thursday", etiqueta: "Jueves"},
    {valor: "Friday", etiqueta: "Viernes"},
    {valor: "Saturday", etiqueta: "Sábado"}
  ]

  estados: any[] = [
    { valor: '1', etiqueta: "Activo" },
    { valor: '0', etiqueta: "Inactivo" }]

  displayedColumns: string[] = ['nombreBeneficiado', 'actividad'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  registerForm2: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectBeneficiado = "";

  NuevaCategoriaId="";
  cantidad_categoria = 0;
  

  constructor(
    private cdr: ChangeDetectorRef, 
    private formBuilder: FormBuilder,
    private _util: UtilService,
    private _beneficiado: BeneficiadosService,
    private _categorias: CategoriasService) { 

    this.registerForm = this.formBuilder.group({
      beneficiado_id: [""],
      beneficiado_nombre: ["",Validators.required],
      beneficiado_actividad: ["",Validators.required],
      beneficiado_periodo: ["",Validators.required],
      beneficiado_dia_entrega: ["",Validators.required],
      beneficiado_ultima_entrega: [""],
      beneficiado_telefono: [""],
      beneficiado_representante: [""],
      beneficiado_estado: [""]
    });

    this.registerForm2 = this.formBuilder.group({
      categorias: this.formBuilder.array([])
    })
  }

  get categorias(){
    return this.registerForm2.controls["categorias"] as FormArray;
  }

  cargarCategorias(beneficiado:any){
    this._categorias.listar_categorias_persona_beneficiado(beneficiado).subscribe({
      next: result=>{
        this.removeAllCategoriasForm()
        result.forEach((element:any) => {
          this.agregarCategoriaForm(element.cat_persona_beneficiado_id,
                                    element.beneficiado_id,
                                    element.categoria_persona_id,
                                    element.cat_persona_beneficiado_cantidad,
                                    element.categoria_persona_nombre,
                                    element.categoria_persona_descripcion,
                                    element.categoria_persona_estado)
        });
      },
      error: e =>{
        this._util.alerta("Error",JSON.stringify(e),"warning")
      }
    })
  }

  agregarCategoriaForm(cat_persona_beneficiado_id:number,
    beneficiado_id:number,
    categoria_persona_id:number,
    cat_persona_beneficiado_cantidad:number,
    categoria_persona_nombre:string,
    categoria_persona_descripcion:string,
    categoria_persona_estado:number,) {
    this.categorias.push(this.formBuilder.group({
      cat_persona_beneficiado_id: [cat_persona_beneficiado_id],
      beneficiado_id: [beneficiado_id],
      categoria_persona_id:[categoria_persona_id],
      cat_persona_beneficiado_cantidad:[cat_persona_beneficiado_cantidad],
      categoria_persona_nombre:[categoria_persona_nombre],
      categoria_persona_descripcion:[categoria_persona_descripcion],
      categoria_persona_estado:[categoria_persona_estado]
    }));
  }

  removeCategoriaForm(index: number) {
    this.categorias.removeAt(index);
  }

  removeAllCategoriasForm() {
    this.categorias.clear();
  }

  nuevaCategoriaPersona():void{
    //crear nueva categoria en la base
    const formData = new FormData();
    formData.append('beneficiado_id', this.registerForm.controls['beneficiado_id'].value);
    formData.append('cat_persona_beneficiado_cantidad', this.cantidad_categoria.toString());
    formData.append('categoria_persona_id', this.NuevaCategoriaId);
    
    this._categorias.crear_categoria_persona_beneficiado(this.registerForm.controls['beneficiado_id'].value).subscribe({
      next: resultado=>{
        this.verBeneficiadoData(this.registerForm.controls['beneficiado_id'].value)
        this.cantidad_categoria = 0
        this.NuevaCategoriaId = ""
        this._util.alerta("Exito",JSON.stringify(resultado),"success")
      },
      error: error=>{
        this._util.alerta("Error",JSON.stringify(error),"warning")
      }
    })
  }

  ngOnInit(): void {
    this.cargarListaBeneficiados()
  }

  onSubmit():void {
    this.guardarDatosBeneficiado()
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarListaBeneficiados():void{
    this._beneficiado.listar_beneficiados().subscribe({
      next: result =>{
        this.listaBeneficiados = result
        this.dataSource = new MatTableDataSource(this.listaBeneficiados);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error : e => {
        this._util.alerta("Error",JSON.stringify(e),"warning")
      }
    })
    
  }

  guardarDatosBeneficiado() {
    Swal.fire({
      title: 'Confirmación',
      text: 'Se guardarán los cambios, ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast: true
    }).then(async (result) => {
      if (result.value) {
        this.submitted = true;
        if (this.registerForm.invalid) {
          return;
        }
  
        if (this.registerForm.controls['beneficiado_id'].value != null) {
          try {
            const response = await this._beneficiado.update_beneficiado(this.registerForm.value).toPromise();
  
            // Actualizar categorias
            for (const element of this.categorias.controls) {
              console.log(element.value);
              if (element.value.cat_persona_beneficiado_id != null) {
                await this._categorias.actualizar_categoria_persona_beneficiado(element.value).toPromise();
              } else {
                if (element.value.cat_persona_beneficiado_cantidad != null) {
                  element.value.beneficiado_id = this.registerForm.controls['beneficiado_id'].value;
                  await this._categorias.crear_categoria_persona_beneficiado(element.value).toPromise();
                }
              }
            }
  
            this.cargarListaBeneficiados();
            this.cargarCategorias(this.registerForm.controls['beneficiado_id'].value);
  
            this._util.alerta('Mensaje', response.mensaje, 'info');
            this.isFormVisible = false;
          } catch (e) {
            this._util.alerta('Error', JSON.stringify(e), 'warning');
          }
        } else {
          try {
            const response = await this._beneficiado.create_beneficiado(this.registerForm.value).toPromise();
  
            this._util.alerta('Mensaje', response.mensaje, 'info');
            this.cargarListaBeneficiados();
            this.isFormVisible = false;
          } catch (e) {
            this._util.alerta('Error', JSON.stringify(e), 'warning');
          }
        }
      }
    });
  }
  

  guardarDatosBeneficiado2(){
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
          if(this.registerForm.controls['beneficiado_id'].value != null){
            this._beneficiado.update_beneficiado(this.registerForm.value)
            .subscribe({
              next:response=>{

                //actualizar_categorias
                this.categorias.controls.forEach(element => {
                  console.log(element.value)
                  if(element.value.cat_persona_beneficiado_id != null){
                    this._categorias.actualizar_categoria_persona_beneficiado(element.value).subscribe({
                      next:response=>{
                        //todo correcto
                      },
                      error:e=>{
                        this._util.alerta("Error",JSON.stringify(e),"error")
                      }
                    })
                  }else{
                    if(element.value.cat_persona_beneficiado_cantidad != null){
                      element.value.beneficiado_id = this.registerForm.controls['beneficiado_id'].value
                      this._categorias.crear_categoria_persona_beneficiado(element.value).subscribe({
                        next:response=>{
                          //ok
                        },
                        error:e=>{
                          this._util.alerta("Error",JSON.stringify(e),"error")
                        }
                      })
                    }
                    
                    
                  }
                });
                    this.cargarListaBeneficiados()
                    this.cargarCategorias(this.registerForm.controls['beneficiado_id'].value)
                    
                    

                this._util.alerta("Mensaje",response.mensaje,"info")
                this.isFormVisible = false;
                
                
                
              },
              error:e=>{
                this._util.alerta("Error",JSON.stringify(e),"warning")
              }
            })
            
          }else{
            this._beneficiado.create_beneficiado(this.registerForm.value)
            .subscribe({
              next:response=>{
                this._util.alerta("Mensaje",response.mensaje,"info")
                this.cargarListaBeneficiados()
                this.isFormVisible = false;
              },
              error:e=>{
                this._util.alerta("Error",JSON.stringify(e),"warning")
              }
            })
          }
          
      }
    })
  }

  resetForm():void{
    this.selectBeneficiado = "[Nuevo Beneficiado]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
    this.removeAllCategoriasForm()
  }

  verBeneficiadoData(id:number):void{
    const beneficiado = this.listaBeneficiados.find((item: { beneficiado_id: number; }) => item.beneficiado_id === id);

    if (beneficiado) {
      this.cargarCategorias(beneficiado.beneficiado_id)
      this.isFormVisible = true;
      this.selectBeneficiado = beneficiado.beneficiado_nombre
      this.registerForm.controls["beneficiado_id"].setValue(beneficiado.beneficiado_id)
      this.registerForm.controls["beneficiado_nombre"].setValue(beneficiado.beneficiado_nombre)
      this.registerForm.controls["beneficiado_actividad"].setValue(beneficiado.beneficiado_actividad)
      this.registerForm.controls["beneficiado_periodo"].setValue(beneficiado.beneficiado_periodo)
      this.registerForm.controls["beneficiado_dia_entrega"].setValue(beneficiado.beneficiado_dia_entrega)
      this.registerForm.controls["beneficiado_ultima_entrega"].setValue(beneficiado.beneficiado_ultima_entrega)
      this.registerForm.controls["beneficiado_telefono"].setValue(beneficiado.beneficiado_telefono)
      this.registerForm.controls["beneficiado_representante"].setValue(beneficiado.beneficiado_representante)
      this.registerForm.controls["beneficiado_estado"].setValue(beneficiado.beneficiado_estado)
    } else {
      this._util.alerta("Error","No se encontro la información del Beneficiado.","warning")
    }
  }

}
