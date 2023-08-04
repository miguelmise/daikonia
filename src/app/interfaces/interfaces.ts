export interface Product {
    cat_pro_id: number;
    cat_pro_nombre: string;
    suma: number;
  }

export interface Acceso {
    id: number;
    nombre: string;
    opciones: string[];
  }

  export interface StockItem {
    cat_pro_id: number;
    cat_pro_nombre: string;
    suma: string;
  }