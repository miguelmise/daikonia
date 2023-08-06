import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';
import { CategoriasService } from 'src/app/servicios/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectCategoriaPersona = "";
  selectCategoriaProducto ="";
  displayedColumns: string[] = ['categoriaNombre','descripcion'];

  listaCategoriaPersonas:any[] = [];
  update_categoria_persona = true;
  listaCategoriaProductos:any[] = [];

  estados: any[] = [
    { valor: '1', etiqueta: "Activo" },
    { valor: '0', etiqueta: "Inactivo" }]

  constructor(private formBuilder: FormBuilder,
              private _util: UtilService,
              private _categorias :CategoriasService) {
    
    this.registerForm = this.formBuilder.group({
      categoria_persona_id: [""],
      categoria_persona_nombre: ["",Validators.required],
      categoria_persona_descripcion: ["",Validators.required],
      categoria_persona_estado: ["",Validators.required]
    });

   }

  ngOnInit(): void {
    this.cargarListaCategoriasPersonas()
  }

  cargarListaCategoriasPersonas():void{
    this._categorias.listar_categorias_personas().subscribe({
      next:res=>{
        this.listaCategoriaPersonas = res
        this.dataSource = new MatTableDataSource(this.listaCategoriaPersonas);
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this._util.alerta_error(JSON.stringify(err.error))
      }
    })
  }

  

  onSubmit():void {
    
  }
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  

  resetForm():void{
    this.selectCategoriaPersona = "[Nueva Categoria]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
    this.update_categoria_persona = false;
  }
  
  

  
  verCategoriaPersonaData(id:number):void{
    this.update_categoria_persona = true;
    const categoriaPersona = this.listaCategoriaPersonas.find((item: { categoria_persona_id: number; }) => item.categoria_persona_id === id);

    if (categoriaPersona) {
      this.isFormVisible = true;
      this.selectCategoriaPersona = categoriaPersona.categoria_persona_nombre
      this.registerForm.controls["categoria_persona_id"].setValue(categoriaPersona.categoria_persona_id)
      this.registerForm.controls["categoria_persona_nombre"].setValue(categoriaPersona.categoria_persona_nombre)
      this.registerForm.controls["categoria_persona_descripcion"].setValue(categoriaPersona.categoria_persona_descripcion)
      this.registerForm.controls["categoria_persona_estado"].setValue(categoriaPersona.categoria_persona_estado)
    } else {
      this._util.alerta("Error","No se encontro la información de la Categoria.","warning")
    }
  }
 

  guardarCategoriaPersona():void{
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

          if(this.update_categoria_persona){
            this._categorias.actualizar_categoria_persona(this.registerForm.value).subscribe({
              next:res=>{
                if (res.mensaje) {
                  this._util.alerta_success(res.mensaje);
                } else {
                  this._util.alerta_error(res.error);
                }
                this.cargarListaCategoriasPersonas()
              },
              error: err=>{
                this._util.alerta_error(JSON.stringify(err))
              }
            })
          }else{
            this._categorias.nuevo_categoria_persona(this.registerForm.value).subscribe({
              next:res=>{
                if (res.mensaje) {
                  this._util.alerta_success(res.mensaje);
                } else {
                  this._util.alerta_error(res.error);
                }
                this.cargarListaCategoriasPersonas()
                this.resetForm()
                this.isFormVisible = false;
              },
              error: err=>{
                this._util.alerta_error(JSON.stringify(err.error))
              }
            })
          }
          
      }
    })
  }
  informacion(){
    Swal.fire({
      html: `<p>Pantalla de creación y modificación de categorias.</p>
      <p><b>Consideraciones:</b></p>
      <ul>
        <li>Las categorias pueden inactivarse, en caso de hacerlo, ya no se considerarán en el proceso para la generación de una orden.</li>
        
      
      </ul>
      `,
      icon: 'info',
      confirmButtonColor: '#006e8c'
    })
  }

  
  
}
