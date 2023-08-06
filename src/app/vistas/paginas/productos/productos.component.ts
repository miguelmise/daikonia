import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriasService } from 'src/app/servicios/categorias.service';
import { PlanificadorService } from 'src/app/servicios/planificador.service';
import { ProductosService } from 'src/app/servicios/productos.service';
import { UtilService } from 'src/app/servicios/utilidades/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  id_sin_categoria:number = 26;

  @Output() cargarAlertas = new EventEmitter();

  estados: any[] = [
    { valor: '1', etiqueta: "Activo" },
    { valor: '0', etiqueta: "Inactivo" }]

  listaProductos: any[] = [];
  listaCategorias: any[] = [];
  listaMedidasPeso: any[] = [{"tipo": "KG"},{"tipo": "GR"},{"tipo": "ML"},{"tipo": "LT"},];

  displayedColumns: string[] = ['codigo','producto','categoria', 'peso', 'stock'];

  dataSource!: MatTableDataSource<any>;

  dataTable!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  registerForm: FormGroup;
  submitted = false;
  isFormVisible: boolean = false;
  selectProducto = "";
  update_producto = true;

  lista_productos_invalidos:any[] = []; 

  constructor(private cdr: ChangeDetectorRef, 
              private formBuilder: FormBuilder, 
              private _util: UtilService, 
              private _producto : ProductosService,
              private _categorias : CategoriasService,
              private _planificador: PlanificadorService) { 
    this.registerForm = this.formBuilder.group({
      producto_id: [""],
      producto_categoria_id: ["",Validators.required],
      producto_codigo: ["",Validators.required],
      producto_descripcion: ["",Validators.required],
      producto_estado: ["",Validators.required],
      producto_medida: ["",Validators.required],
      producto_peso: ["",Validators.required],
      producto_precio: ["",Validators.required],
      producto_sku: ["",Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarListaCategorias();
    this.cargarListaProductos();  
    this.cargarAlertasProductos();
      
  }

  cargarAlertasProductos():void{
    this._planificador.listar_productos_invalidos().subscribe({
      next:res=>{
        this.lista_productos_invalidos = res
      },error:err=>{
        this._util.alerta_error(JSON.stringify(err))
      }
    })
  }

  producto_cookie():void{
    const productoId = this._util.getProducto()
    if(productoId != '404'){
      this.verProductoData(parseInt(productoId))
    }
  }

  cargarListaProductos():void{
    this._producto.listar_productos().subscribe({
      next: res=>{
        this.listaProductos = res;
        this.dataSource = new MatTableDataSource(this.listaProductos);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.producto_cookie()
      },
      error: err=>{
        this._util.alerta_error(JSON.stringify(err));
      }
    })
  }

  cargarListaCategorias():void{
    this._categorias.listar_categorias_productos().subscribe({
      next: res=>{
        this.listaCategorias = res;
      },
      error: err=>{
        this._util.alerta_error(JSON.stringify(err));
      }
    })
  }

  resetForm():void{
    this.maximizarVentana()
    this.update_producto = false;
    this.selectProducto = "[Nuevo Producto]"
    this.isFormVisible = true;
    this.submitted = false;
    this.registerForm.reset();
  }

  minimizarventana():void{
    this.isFormVisible = false;
    const divElement = document.getElementById('div_tabla');
    if (divElement) {
      divElement.classList.remove('col-lg-6');
      divElement.classList.add('col-lg-12');
    }
  }

  maximizarVentana():void{
    const divElement = document.getElementById('div_tabla');
    if (divElement) {
      divElement.classList.remove('col-lg-12');
      divElement.classList.add('col-lg-6');
    }
  }

  isSinCategoria(element: any): boolean {
    return element.cat_pro_nombre === "Sin Categoria";
  }

  sinPeso(element: any): boolean {
    return element.producto_peso == 0;
  }
  
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showAllData() {
    // Restablecer el filtro a una cadena vacía para mostrar todos los elementos
    this.dataSource.filter = '';
  }

  applyFilterAlertados() {
    // Definir la función personalizada de filtrado
    this.dataSource.filterPredicate = (data: any) => {
      return (
        data.cat_pro_main_categoria.toLowerCase() === "sin categoria" ||
        data.producto_peso === 0
      );
    };
  
    // Limpiar el filtro previo y aplicar el filtro vacío para activar el filterPredicate
    this.dataSource.filter = '';
  
    // Aplicar el filtro vacío para activar el filterPredicate
    this.dataSource.filter = ' ';
  }
  
  

  onSubmit():void {
    this.guardarDatosProducto()
  }

  guardarDatosProducto(){
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

          if(this.update_producto){
            this._producto.actualizar_producto(this.registerForm.value).subscribe({
              next:res=>{
                if(res.mensaje){
                  this._util.alerta_success(res.mensaje)
                }else{
                  this._util.alerta_info(JSON.stringify(res))
                }
                
                this.cargarListaProductos();
                this.cargarAlertasProductos();
                this.cargarAlertas.emit();
              },
              error: err=>{
                this._util.alerta_error(JSON.stringify(err.error))
              }
            })
          }else{
            this._producto.nuevo_producto(this.registerForm.value).subscribe({
              next:res=>{
                if(res.mensaje){
                  this._util.alerta_success(res.mensaje)
                }else{
                  this._util.alerta_info(JSON.stringify(res))
                }
                this.cargarListaCategorias();
                this.cargarListaProductos();
                this.minimizarventana();
                this.cargarAlertas.emit();
                this.cargarAlertasProductos();
              },
              error: err=>{
                this._util.alerta_error(JSON.stringify(err.error))
              }
            })
          }
          
      }
    })
  }

  verProductoData(id:number):void{
    this.maximizarVentana()
    this.update_producto = true;
    const producto = this.listaProductos.find((item: { producto_id: number; }) => item.producto_id === id);

    if (producto) {
      this.isFormVisible = true;
      this.selectProducto = producto.producto_descripcion
      this.registerForm.controls["producto_id"].setValue(producto.producto_id)
      this.registerForm.controls["producto_codigo"].setValue(producto.producto_codigo)
      this.registerForm.controls["producto_categoria_id"].setValue(producto.producto_categoria_id)
      this.registerForm.controls["producto_descripcion"].setValue(producto.producto_descripcion)
      this.registerForm.controls["producto_medida"].setValue(producto.producto_medida)
      this.registerForm.controls["producto_peso"].setValue(producto.producto_peso)
      this.registerForm.controls["producto_precio"].setValue(producto.producto_precio)
      this.registerForm.controls["producto_sku"].setValue(producto.producto_sku)
      this.registerForm.controls["producto_estado"].setValue(producto.producto_estado)
    } else {
      this._util.alerta("Error","No se encontro la información del Producto.","warning")

    }
  }
  informacion(){
    Swal.fire({
      html: `<p>El peso ingresado debe corresponder al peso total del producto, es decir:</b></p>
      <ul>
        <li>Si el producto es una unidad debe se ingresa el peso de la unidad.</li>
        <li>Si el producto es una caja, se ingresa el peso de la caja y no de la unidad que contenga la caja.</li>
      </ul>
      <br>
      `,
      icon: 'info',
      confirmButtonColor: '#006e8c'
    })
  }

}
