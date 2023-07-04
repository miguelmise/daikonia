import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectCategoriaPersona = "";
  displayedColumns: string[] = ['categoriaNombre','id'];
  categoriaPersona: any[] = [
    {id: 1, categoriaNombre:"Adulto", descripcion:"De 16 a 28 años"},
    {id: 2, categoriaNombre:"Niño", descripcion:"De 0 a 15 años"}
    
  ];
  
  constructor(private formBuilder: FormBuilder,private _util: UtilService,) {
    
    this.registerForm = this.formBuilder.group({
      categoria_id: [""],
      categoria_nombre: ["",Validators.required],
      categoria_descripcion: ["",Validators.required]
    });
   }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.categoriaPersona);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  verCategoriaPersonaData(id:number):void{
    const categoriaPersona = this.categoriaPersona.find((item: { id: number; }) => item.id === id);

    if (categoriaPersona) {
      this.isFormVisible = true;
      this.selectCategoriaPersona = categoriaPersona.categoriaNombre
      this.registerForm.controls["categoria_nombre"].setValue(categoriaPersona.categoriaNombre)
      this.registerForm.controls["categoria_descripcion"].setValue(categoriaPersona.descripcion)
    } else {
      this._util.alerta("Error","No se encontro la información de la Categoria.","warning")
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
