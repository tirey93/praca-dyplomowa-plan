import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-create-course-dialog',
  imports: [
    MatDialogContent, MatDialogTitle, MatDialogActions, MatTooltipModule, MatButtonModule
  ],
  templateUrl: './create-course-dialog.component.html',
  styleUrl: './create-course-dialog.component.scss'
})
export class CreateCourseDialogComponent {
  groupForm = new FormGroup({

  });

  constructor(
    private dialogRef: MatDialogRef<CreateCourseDialogComponent>,
  ) {
    
  }

  onNoClick(): void {
    console.log('No');
    this.dialogRef.close(false);
  }
  submit() {
    console.log('submit');
  }
}
