import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');

    if (!user || !user.isSupported) {
      this.router.navigate(['/login']);  
      return false;
    }

    return true; 
  }
}
