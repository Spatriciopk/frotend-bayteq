import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

import { LoginService } from '../../core/services/login/login.service';
import { SharedModule } from '../../shared/shared.module';
import { ErrorSnackbarComponent } from '../../core/components/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  @ViewChild('snackbarContainer', { read: ViewContainerRef })
  snackbarContainer!: ViewContainerRef;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user?.isSupported) {
      const route = user.role === 'analyst' ? '/analysts' :
                    user.role === 'manager' ? '/sales-management' : '/login';
      this.router.navigate([route]);
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      this.showError('Por favor completa los campos obligatorios');
      return;
    }

    this.loginService.validateUser(this.username, this.password).subscribe({
      next: (user) => {
        if (!user) {
          this.showError('Credenciales incorrectas');
          return;
        }

        sessionStorage.setItem('user', JSON.stringify(user));
        const route = user.role === 'analyst' ? '/analysts' :
                      user.role === 'manager' ? '/sales-management' : '/login';
        this.router.navigate([route]);
      },
      error: (err) => {
        this.showError(err.message || 'Error de autenticación');
      }
    });
  }

  private showError(message: string) {
    this.snackbarContainer.clear(); 

    const componentRef = this.snackbarContainer.createComponent(ErrorSnackbarComponent);
    componentRef.setInput('message', message);
    componentRef.setInput('color', '#f44336');
    componentRef.setInput('icon', 'error');


    setTimeout(() => {
      componentRef.destroy();
    }, 3000);
  }
}
