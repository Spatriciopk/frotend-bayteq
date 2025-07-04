import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment'; 



@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiBaseUrl;  

  constructor(private http: HttpClient,private router: Router) {}


  validateUser(username: string, password: string): Observable<any> {
    return this.getUserByCredentials(username, password).pipe(
      switchMap(user => this.getRoleForUser(user)),
      map(response => this.checkRoleSupport(response)),
      catchError(error => {
        return throwError(() => new Error('Credenciales incorrectas'))
      })
    );
  }

  
  private getUserByCredentials(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('email', username)
      .set('password', password);

    return this.http.get<any[]>(`${this.apiUrl}/users`, { params }).pipe(
      
      map(users => {
        if (users.length === 0) {
          return throwError(() => new Error('Credenciales incorrectas')); 
        }
        return users[0];  
      })
    );
  }


  private getRoleForUser(user: any): Observable<any> {
    const roleParams = new HttpParams().set('code', user.role);
    return this.http.get<any[]>(`${this.apiUrl}/roles`, { params: roleParams }).pipe(
      map(roles => {
        if (roles.length === 0) {
          return throwError(() => new Error('Rol no existe'));
        }
        return { user, role: roles[0] };  
      })
    );
  }

 
  private checkRoleSupport(response: any): any {
    if (!response || !response.role.isSupported) {
      return throwError(() => new Error('Rol no soportado'));
    }
    
    return {
      ...response.user,
      isSupported: response.role.isSupported
    };
  }

   logout(): void {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}