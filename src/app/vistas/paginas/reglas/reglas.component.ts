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
  cantidadCatProducto : number = 0;
  nombreSelectCategoria: String = ""

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

  botonDeshabilitado(): boolean {
    return this.cantidadCatProducto < 1 || this.selectCatProducto === 0;
  }

  agregarNuevaPorcion():void{
    this._porciones.crearNuevo(this.selectCatPersona,this.selectCatProducto,this.cantidadCatProducto).subscribe({
      next:res=>{
        if (res.mensaje) {
          this._util.alerta_temporal(res.mensaje)
          this.cargarCategorias()
        } else {
          this._util.alerta_error(res.error);
        }
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err));
      }
    })
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

  async cargarCategorias() {
    try {
      const result = await this._categorias.listar_categorias_personas().toPromise();
      this.removeAllCategoriasForm();
  
      for (const element of result) {
        const res = await this._porciones.listar_por_id_categoria(element.categoria_persona_id).toPromise();
        this.agregarCategoriaForm(
          element.categoria_persona_id,
          element.categoria_persona_nombre,
          res
        );
      }
  
      
    } catch (e) {
      this._util.alerta("Error", JSON.stringify(e), "warning");
    }
  }

  borrarporcion(id:any){
    Swal.fire({
      title: 'Confirmación',
      text: 'Se eliminará la porción, ¿Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1cc88a',
      toast:true
    }).then((result)=>{
      if(result.value){
        this.eliminar(id)
      }
    })
  }

  eliminar(id:any):void{
    this._porciones.eliminar(id).subscribe({
      next:res=>{
        if(res.mensaje){
          this._util.alerta_temporal(res.mensaje)
          this.cargarCategorias()
        }else{
          this._util.alerta_info(JSON.stringify(res))
        }
      },error:err=>{
        if (err.error) {
          this._util.alerta_error(err.error)
        } else {
          this._util.alerta_error(JSON.stringify(err))
        }
      }
    })
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

  cargarModal(id:number,nombre:any):void{
    this.selectCatPersona = id
    this.selectCatProducto = 0
    this.cantidadCatProducto = 0
    this.nombreSelectCategoria = nombre
    this.cargarCategoriasProductos()
  }

  cargarCategoriasProductos():void{
    this._categorias.listar_categorias_productos().subscribe({
      next:res=>{
        this.listaCatProductos = res;
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
  informacion(){
    Swal.fire({
      html: `<p>Se asigna la cantidad en gramos de cada categoría de productos por categoria de persona.</p>
      
      `,
      icon: 'info',
      confirmButtonColor: '#006e8c'
    })
  }

}
