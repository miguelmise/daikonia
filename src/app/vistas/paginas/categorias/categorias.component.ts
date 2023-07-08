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

  dataSourceCategoriaProducto!: MatTableDataSource<any>;

  @ViewChild('paginatorCategoriaProducto') paginatorCategoriaProducto!: MatPaginator;
  

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
      categoria_persona_estado: ["",Validators.required],
      cat_pro_id:[""],
      cat_pro_nombre:[""],
      cat_pro_descripcion:[""],
      cat_pro_main_categoria:[""],
      cat_pro_estado:[""]
    });

   }

  ngOnInit(): void {
    this.cargarListaCategoriasPersonas()
    this.cargarListaCategoriasProductos()
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

  cargarListaCategoriasProductos():void{
    this._categorias.listar_categorias_productos().subscribe({
      next: res=>{
        this.listaCategoriaProductos = res;
        this.dataSourceCategoriaProducto = new MatTableDataSource(this.listaCategoriaProductos);
        this.dataSourceCategoriaProducto.paginator = this.paginatorCategoriaProducto;
        console.log(this.listaCategoriaProductos)
      },
      error: err=>{
        this._util.alerta_error(JSON.stringify(err));
      }
    })
  }

  onSubmit():void {
    
  }
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterProductos(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCategoriaProducto.filter = filterValue.trim().toLowerCase();
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
  verCategoriaProductoData(id:number):void{
    const categoriaProducto = this.listaCategoriaProductos.find((item: { cat_pro_id: number; }) => item.cat_pro_id === id);

    if (categoriaProducto) {
      this.isFormVisible = true;
      this.selectCategoriaProducto = categoriaProducto.cat_pro_nombre
      this.registerForm.controls["cat_pro_id"].setValue(categoriaProducto.cat_pro_id)
      this.registerForm.controls["cat_pro_nombre"].setValue(categoriaProducto.cat_pro_nombre)
      this.registerForm.controls["cat_pro_descripcion"].setValue(categoriaProducto.cat_pro_descripcion)
      this.registerForm.controls["cat_pro_main_categoria"].setValue(categoriaProducto.cat_pro_main_categoria)
      this.registerForm.controls["cat_pro_estado"].setValue(categoriaProducto.cat_pro_estado)
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
                this._util.alerta_success(res.mensaje)
                this.cargarListaCategoriasPersonas()
              },
              error: err=>{
                this._util.alerta_error(JSON.stringify(err))
              }
            })
          }else{
            this._categorias.nuevo_categoria_persona(this.registerForm.value).subscribe({
              next:res=>{
                this._util.alerta_success(res.mensaje)
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

  guardar(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
        
      },
      buttonsStyling: false,
      
      toast:true,
      confirmButtonColor: '#1cc88a',
    })
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
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Guardado!',
          'La categoria ha sido guardada.',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          '',
          'error'
        )
      }
    })
  }
  
}
