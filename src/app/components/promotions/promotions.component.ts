import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { ErrorSnackbarComponent } from '../../core/components/error-snackbar/error-snackbar.component';



@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule,],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  products: any[] = [];
  originalProducts: any[] = [];  
  role: string = '';
  filterText: string = '';
  selectedIds = new Set<number>();  
  
  @ViewChild('snackbarContainer', { read: ViewContainerRef })
  snackbarContainer!: ViewContainerRef;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.role = user?.role || '';

    if (!user || !user.isSupported) {
      this.router.navigate(['/login']);
      return;
    }

    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.originalProducts = JSON.parse(JSON.stringify(products));  
    });
  }

filteredProducts(): any[] {
  if (this.role === 'analyst') {

    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  } else if (this.role === 'manager') {

    return this.products.filter(p =>
      p.estado === 'EN GESTION' &&
      p.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  } else {

    return [];
  }
}


  getEstadoClass(estado: string): string {
    return estado.toLowerCase().replace(/\s+/g, '-'); 
  }

  toggleSelection(productId: number, estado: string): void {

    if (estado !== 'EDICION') return;

    if (this.selectedIds.has(productId)) {
      this.selectedIds.delete(productId);  
    } else {
      this.selectedIds.add(productId);  
    }
  }

  isSelected(productId: number): boolean {
    return this.selectedIds.has(productId); 
  }

private validateProductQuantities(product: any): boolean {
  if (product.minPromotionQuantity < 0 || product.maxPromotionQuantity < 0) {
    this.showPopUp("Las cantidades no pueden ser menores a cero.", '#FF5722', 'error');
    return false;
  }

  if (!Number.isInteger(product.minPromotionQuantity) || !Number.isInteger(product.maxPromotionQuantity)) {
    this.showPopUp("Las cantidades deben ser números enteros.", '#FF5722', 'error');
    return false;
  }

  if (product.maxPromotionQuantity <= product.minPromotionQuantity) {
    this.showPopUp("La cantidad máxima debe ser mayor que la cantidad mínima.", '#FF5722', 'error');
    return false;
  }

  return true; 
}


private validatePromotionPrice(product: any): boolean {
  if (product.precioPromocion <= product.minPromotionPrice) {
    this.showPopUp("El precio promocional no puede ser menor o igual que el precio mínimo de promoción.", '#FF5722', 'error');
    return false;
  }

  if (product.precioPromocion > product.listPrice) {
    this.showPopUp("El precio promocional debe ser menor que el precio de lista.", '#FF5722', 'error');
    return false;
  }

  return true;  
}


  submitPromotions(): void {

    if(this.selectedIds.size <=0){
      this.showPopUp("Advertencia, ningún producto seleccionado", '#FFEB3B', 'warning');
      return;
    }


    let flagValidador = false;

    const updatedProducts = this.products.map(p => {
      if (this.selectedIds.has(p.id)) {
            if (!this.validateProductQuantities(p)) {
                  flagValidador = true;
                  return p;  
            }
            if (!this.validatePromotionPrice(p)) {
              flagValidador = true;
              return p;  
            }

        return { ...p, estado: 'EN GESTION' };
      } else {
        const originalProduct = this.originalProducts.find(original => original.id === p.id);
        return { ...originalProduct, estado: p.estado };  
      }
    });

    if(flagValidador ){
      return;
    }
    localStorage.setItem('cachedProducts', JSON.stringify(updatedProducts));
    this.products = updatedProducts;
    this.selectedIds.clear();

    this.showPopUp("Promociones enviadas con éxito",'#4CAF50', 'check_circle')
  }


  
approveAll(): void {
  const filtered = this.filteredProducts();
  if(filtered.length <= 0){
    this.showPopUp("Advertencia, No existen promociones por revisar", '#FFEB3B', 'warning');
    return
  }
  const allProducts = JSON.parse(localStorage.getItem('cachedProducts') || '[]');

  const updatedAllProducts = (allProducts as Array<{ id: number; estado: string; [key: string]: any }>).map(product => {
    const match = filtered.find(p => p.id === product.id);
    if (match) {
      return { ...product, estado: 'APROBADO' };
    }
    return product;
  });

  this.products = updatedAllProducts;
  localStorage.setItem('cachedProducts', JSON.stringify(updatedAllProducts));
  this.showPopUp('Todos los productos han sido aprobados.', '#4CAF50', 'check_circle');
}

rejectAll(): void {
  const filtered = this.filteredProducts();
  if(filtered.length <= 0){
    this.showPopUp("Advertencia, No existen promociones por revisar", '#FFEB3B', 'warning');
    return
  }
  const allProducts = JSON.parse(localStorage.getItem('cachedProducts') || '[]');

  const updatedAllProducts = (allProducts as Array<{ id: number; estado: string; [key: string]: any }>).map(product => {
    const match = filtered.find(p => p.id === product.id);
    if (match) {
      return { ...product, estado: 'EDICION' };
    }
    return product;
  });

  this.products = updatedAllProducts;
  localStorage.setItem('cachedProducts', JSON.stringify(updatedAllProducts));
  this.showPopUp('Todos los productos han sido enviados a edición.', '#FF5722', 'cancel');
}


cambiarEstado(id: number, accion: 'aprobar' | 'rechazar'): void {
  const nuevoEstado = accion === 'aprobar' ? 'APROBADO' : 'EDICION';
  const mensaje = accion === 'aprobar'
    ? 'Producto aprobado.'
    : 'Producto enviado a edición.';
  const color = accion === 'aprobar' ? '#4CAF50' : '#FF5722';
  const icono = accion === 'aprobar' ? 'check_circle' : 'cancel';

  const allProducts = JSON.parse(localStorage.getItem('cachedProducts') || '[]') as Array<{ id: number; estado: string; [key: string]: any }>;

  const updatedProducts = allProducts.map(product => {
    if (product.id === id) {
      return { ...product, estado: nuevoEstado };
    }
    return product;
  });

  this.products = updatedProducts;
  localStorage.setItem('cachedProducts', JSON.stringify(updatedProducts));

  this.showPopUp(mensaje, color, icono);
}

  private showPopUp(message: string, color: string,icon:string) {
    this.snackbarContainer.clear(); 

    const componentRef = this.snackbarContainer.createComponent(ErrorSnackbarComponent);
    componentRef.setInput('message', message);
    componentRef.setInput('color', color);
    componentRef.setInput('icon', icon);

    setTimeout(() => {
      componentRef.destroy();
    }, 3000);
  }
}
