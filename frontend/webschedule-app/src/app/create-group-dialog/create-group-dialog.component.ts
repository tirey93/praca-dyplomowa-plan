import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-group-dialog',
  imports: [ 
    MatDialogContent, MatDialogTitle, MatFormFieldModule, MatLabel, MatInputModule, MatDialogActions, MatButtonModule,
    
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.scss'
})
export class CreateGroupDialogComponent {
submit() {
console.log('submit');
}


  constructor() {
    
  }
}
