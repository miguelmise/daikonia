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
  @ViewChild(MatSort) sort!: MatSort;

  dataSourceCategoriaProducto!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorCategoriaProducto!: MatPaginator;
  @ViewChild(MatSort) sortCategoriaProducto!: MatSort;

  dataSourceSubCategoriaProducto!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorSubCategoriaProducto!: MatPaginator;
  @ViewChild(MatSort) sortSubCategoriaProducto!: MatSort;
  registerForm: FormGroup;
  registerFormCategoria: FormGroup;
  registerFormSubCategoria: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectCategoriaPersona = "";
  selectCategoriaProducto ="";
  selectSubCategoriaProducto="";
  displayedColumns: string[] = ['categoriaNombre','descripcion'];
  displayedColumnsProduct: string[] = ['categoriaNombre','id'];
  displayedColumnsSubProduct: string[] = ['subcategoriaNombre','categoriaNombre','id'];

  listaCategoriaPersonas:any[] = [];

  estados: any[] = [
    { valor: '1', etiqueta: "Activo" },
    { valor: '0', etiqueta: "Inactivo" }]

  categoriaProductos: any[] = [
    {id: 1, categoriaNombre:"Proteínas", descripcion:""},
    {id: 2, categoriaNombre:"Grasas", descripcion:""},
    {id: 3, categoriaNombre:"Frutas", descripcion:""},
    {id: 4, categoriaNombre:"Cereales", descripcion:""},
    {id: 5, categoriaNombre:"Dulces", descripcion:""},
    {id: 6, categoriaNombre:"Lácteos", descripcion:""}
  ];
  subcategoriaProductos: any[] = [
    {id: 1, subcategoriaNombre:"Sub Categoria 1",categoriaNombre:"Proteínas", descripcion:"Descripcion Sub Categoria 1"},
    {id: 2, subcategoriaNombre:"Sub Categoria 2",categoriaNombre:"Proteínas", descripcion:"Descripcion Sub Categoria 2"},
    {id: 3, subcategoriaNombre:"Sub Categoria 3",categoriaNombre:"Frutas", descripcion:"Descripcion Sub Categoria 3"},
    {id: 4, subcategoriaNombre:"Sub Categoria 4",categoriaNombre:"Cereales", descripcion:"Descripcion Sub Categoria 4"},
    {id: 5, subcategoriaNombre:"Sub Categoria 5",categoriaNombre:"Cereales", descripcion:"Descripcion Sub Categoria 5"},
    {id: 6, subcategoriaNombre:"Sub Categoria 6",categoriaNombre:"Lácteos", descripcion:"Descripcion Sub Categoria 6"}
  ];
  
  constructor(private formBuilder: FormBuilder,
              private _util: UtilService,
              private _categorias :CategoriasService) {
    
    this.registerForm = this.formBuilder.group({
      categoria_persona_id: [""],
      categoria_persona_nombre: ["",Validators.required],
      categoria_persona_descripcion: ["",Validators.required],
      categoria_persona_estado: ["",Validators.required]
    });
    this.registerFormCategoria = this.formBuilder.group({
      categoria_id: [""],
      categoria_nombre: ["",Validators.required],
      categoria_descripcion: [""]
    });
    this.registerFormSubCategoria = this.formBuilder.group({
      categoria_id: [""],
      sub_categoria_nombre: ["",Validators.required],
      categoria_nombre: ["",Validators.required],
      categoria_descripcion: [""]
    });
   }

  ngOnInit(): void {
    this.cargarListaCategoriasPersonas()
    
    this.dataSourceCategoriaProducto = new MatTableDataSource(this.categoriaProductos);
    this.dataSourceCategoriaProducto.paginator = this.paginatorCategoriaProducto;
    this.dataSourceCategoriaProducto.sort = this.sortCategoriaProducto;

    this.dataSourceSubCategoriaProducto = new MatTableDataSource(this.subcategoriaProductos);
    this.dataSourceSubCategoriaProducto.paginator = this.paginatorSubCategoriaProducto;
    this.dataSourceSubCategoriaProducto.sort = this.sortSubCategoriaProducto;
  }

  cargarListaCategoriasPersonas():void{
    this._categorias.listar_categorias_personas().subscribe({
      next:res=>{
        this.listaCategoriaPersonas = res
        this.dataSource = new MatTableDataSource(this.listaCategoriaPersonas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    //this.removeAllCategoriasForm()
  }
  resetFormCategoriaProducto():void{
    this.selectCategoriaProducto = "[Nueva Categoria]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerFormCategoria.reset();
    //this.removeAllCategoriasForm()
  }
  resetFormSubCategoriaProducto():void{
    this.selectSubCategoriaProducto = "[Nueva Categoria]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerFormSubCategoria.reset();
    //this.removeAllCategoriasForm()
  }
  
  verCategoriaPersonaData(id:number):void{
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
    const categoriaProducto = this.categoriaProductos.find((item: { id: number; }) => item.id === id);

    if (categoriaProducto) {
      this.isFormVisible = true;
      this.selectCategoriaProducto = categoriaProducto.categoriaNombre
      this.registerFormCategoria.controls["categoria_nombre"].setValue(categoriaProducto.categoriaNombre)
      this.registerFormCategoria.controls["categoria_descripcion"].setValue(categoriaProducto.descripcion)
    } else {
      this._util.alerta("Error","No se encontro la información de la Categoria.","warning")
    }
  }
  verSubCategoriaProductoData(id:number):void{
    const subcategoriaProducto = this.subcategoriaProductos.find((item: { id: number; }) => item.id === id);

    if (subcategoriaProducto) {
      this.isFormVisible = true;
      this.selectSubCategoriaProducto = subcategoriaProducto.categoriaNombre
      this.registerFormSubCategoria.controls["categoria_nombre"].setValue(subcategoriaProducto.categoriaNombre)
      this.registerFormSubCategoria.controls["sub_categoria_nombre"].setValue(subcategoriaProducto.subcategoriaNombre)
      this.registerFormSubCategoria.controls["categoria_descripcion"].setValue(subcategoriaProducto.descripcion)
    } else {
      this._util.alerta("Error","No se encontro la información de la SubCategoria.","warning")
    }
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
  eliminar(){
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
      title: 'Eliminar Categoría',
      text: "Se eliminará la Categoría, ¿Continuar?",
      icon: 'warning',
      toast:true,
      confirmButtonColor: '#1cc88a',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
     
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'La categoria ha sido eliminada.',
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
