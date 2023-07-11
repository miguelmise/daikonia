import { Component, OnInit, ElementRef  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CategoriasService } from 'src/app/servicios/categorias.service';
import { PorcionesService } from 'src/app/servicios/porciones.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.component.html',
  styleUrls: ['./reglas.component.css']
})
export class ReglasComponent implements OnInit {

  listaCatPersonas: any[] = [];
  listaCatProductos: any[] = [];

  selectCatPersona : number = 0;
  selectCatProducto : number = 0;

  registerForm: FormGroup;

  constructor(
    private _util : UtilService,
    private _porciones : PorcionesService,
    private formBuilder: FormBuilder,
    private _categorias : CategoriasService,
    private elementRef: ElementRef
  ) { 
    this.registerForm = this.formBuilder.group({
      categoriasForm: this.formBuilder.array([])
    })
  }

  get categoriasForm(){
    return this.registerForm.controls["categoriasForm"] as FormArray;
  }

  agregarCategoriaForm(categoria_persona_id:number,
    categoria_persona_nombre:string,
    categorias_productos:any) {
    this.categoriasForm.push(this.formBuilder.group({
      categoria_persona_id: [categoria_persona_id],
      categoria_persona_nombre: [categoria_persona_nombre],
      categorias_productos:[categorias_productos]
    }));
  }

  removeCategoriaForm(index: number) {
    this.categoriasForm.removeAt(index);
  }

  removeAllCategoriasForm() {
    this.categoriasForm.clear();
  }

  cargarCategorias() {
    this._categorias.listar_categorias_personas().subscribe({
      next: result => {
        this.removeAllCategoriasForm();
        result.forEach((element: any) => {
          this._porciones.listar_por_id_categoria(element.categoria_persona_id).subscribe({
            next: res => {
              this.agregarCategoriaForm(
                element.categoria_persona_id,
                element.categoria_persona_nombre,
                res
              );
            },
            error: err => {
              this._util.alerta_error(JSON.stringify(err));
            }
          });
        });
        console.log(this.registerForm.value);
      },
      error: e => {
        this._util.alerta("Error", JSON.stringify(e), "warning");
      }
    });
  }

  actualizarValor(inputId: string) {
    const inputElement = this.elementRef.nativeElement.querySelector(`#${'x'+inputId}`);
    const valor = inputElement.value;
    this._porciones.actualizarCantidad(parseInt(inputId),valor).subscribe({
      next:res=>{
        if (res.mensaje) {
          this._util.alerta_temporal(res.mensaje)
        } else {
          this._util.alerta_error(res.error);
        }
      },
      error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
    
  }

  
  

  ngOnInit(): void {
    this.cargarCategorias()
    
  }

  cargarModal():void{
    this.cargarCategoriasProductos()
  }

  cargarCategoriasProductos():void{
    this._categorias.listar_categorias_productos().subscribe({
      next:res=>{
        this.listaCatProductos = res;
        console.log(res)
      }, error: err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }

  listar():void{
    this._porciones.listar_por_id_categoria(1).subscribe({
      next:res=>{
        console.log(res)
      },
      error:err=>{
        console.log(err)
      }
    })
  }

}
