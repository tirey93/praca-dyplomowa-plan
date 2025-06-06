import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-group-dialog',
  imports: [ 
    MatDialogContent, MatDialogTitle, MatFormFieldModule, MatLabel, MatInputModule, MatDialogActions, 
    MatButtonModule, ReactiveFormsModule, CommonModule
    
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.scss'
})
export class CreateGroupDialogComponent {
  groupForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    fb: FormBuilder
  ) {
    this.groupForm = fb.group({
      year: [this.getCurrentYear()]
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  getCurrentYear(): number {
    return (new Date()).getFullYear()
  }

  submit() {
    console.log('submit');
  }
}
