import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/products`;
  private localStorageKey = 'cachedProducts';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    const cached = localStorage.getItem(this.localStorageKey);

    if (cached) {
      return of(JSON.parse(cached));
    } else {
      return this.http.get<any[]>(this.apiUrl).pipe(
        map(products => {

          return products.map(product => ({
            ...product,
            estado: 'EDICION',
            precioPromocion: 0.00
          }));
        }),
        tap(productsWithEstado => {
          localStorage.setItem(this.localStorageKey, JSON.stringify(productsWithEstado));
        })
      );
    }
  }

  clearCache(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
