import { Component, OnInit,ViewChild,AfterViewInit  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';
import { CategoriasService } from 'src/app/servicios/categorias.service';

@Component({
  selector: 'app-categoria-producto',
  templateUrl: './categoria-producto.component.html',
  styleUrls: ['./categoria-producto.component.css']
})
export class CategoriaProductoComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  listaCategoriaProductos:any[] = [];

  estados: any[] = [
    { valor: '1', etiqueta: "Activo para Planificación" },
    { valor: '0', etiqueta: "Inactivo para Planificación" }]

    registerForm: FormGroup;
    submitted = false;
    isFormVisible: boolean = false;
    selectCategoriaProducto ="";
    displayedColumns: string[] = ['categoriaNombre','descripcion'];
    update_categoria_producto: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private _util: UtilService,
    private _categorias :CategoriasService) {
    this.registerForm = this.formBuilder.group({
      cat_pro_id:[""],
      cat_pro_nombre:["",Validators.required],
      cat_pro_descripcion:["",Validators.required],
      cat_pro_main_categoria:[""],
      cat_pro_estado:["",Validators.required]
    });
   }

  ngOnInit(): void {
    
    this.cargarListaCategoriasProductos()
  }

  // Código que se ejecuta cuando se muestra el componente
  ngAfterViewInit() {
    this.cargarListaCategoriasProductos()
  }

  

  cargarListaCategoriasProductos():void{
    this._categorias.listar_categorias_productos().subscribe({
      next: res=>{
        this.listaCategoriaProductos = res;
        this.dataSource = new MatTableDataSource(this.listaCategoriaProductos);
        this.dataSource.paginator = this.paginator;
      },
      error: err=>{
        this._util.alerta_error(JSON.stringify(err));
      }
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verCategoriaProductoData(id:number):void{
    this.update_categoria_producto = true;
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

  resetForm():void{
    this.selectCategoriaProducto = "[Nueva Categoria]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
    this.update_categoria_producto = false;
  }

  guardarCategoriaProducto():void{
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

          if(this.update_categoria_producto){
            this._categorias.actualizar_categoria_producto(this.registerForm.value).subscribe({
              next:res=>{
                if (res.mensaje) {
                  this._util.alerta_success(res.mensaje);
                } else {
                  this._util.alerta_error(res.error);
                }
                this.cargarListaCategoriasProductos()
              },
              error: err=>{
                this._util.alerta_error(JSON.stringify(err))
              }
            })
          }else{
            
            this._categorias.nuevo_categoria_producto(this.registerForm.value).subscribe({
              next:res=>{
                if (res.mensaje) {
                  this._util.alerta_success(res.mensaje);
                } else {
                  this._util.alerta_error(res.error);
                }
                this.cargarListaCategoriasProductos()
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
