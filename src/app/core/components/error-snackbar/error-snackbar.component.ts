import { Component, Input  } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-error-snackbar',
  standalone: true,
  imports: [SharedModule,CommonModule],
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.css']
})
export class ErrorSnackbarComponent {
  @Input() message = '';
  @Input() color = '#f44336';
  @Input() icon = 'error';
}
