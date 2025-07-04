import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 



import { MatInputModule } from '@angular/material/input';  
import { MatButtonModule } from '@angular/material/button';  
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatCardModule } from '@angular/material/card';  
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [
    FormsModule, 
    MatInputModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,

  ],
  exports: [
    FormsModule,
     MatInputModule, 
     MatButtonModule, 
     MatFormFieldModule, 
     MatCardModule,
     MatSnackBarModule,
     MatIconModule,

  ]  
})
export class SharedModule {}
