import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectValue } from '../dtos/selectValue';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { StudyCourseRepository } from '../../services/study-course/studyCourseRepository.service';
import { SnackBarErrorService } from '../../services/snack-bar-error-service';

@Component({
  selector: 'app-create-course-dialog',
  imports: [
    MatDialogContent, MatDialogTitle, MatDialogActions, MatTooltipModule, MatButtonModule,
    ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatLabel, CommonModule
  ],
  templateUrl: './create-course-dialog.component.html',
  styleUrl: './create-course-dialog.component.scss'
})
export class CreateCourseDialogComponent {
  courseForm = new FormGroup({
    name: new FormControl(''),
    shortName: new FormControl('', [Validators.minLength(3), Validators.maxLength(5)])
  });

  constructor(
    private dialogRef: MatDialogRef<CreateCourseDialogComponent>,
    private studyCourseService: StudyCourseRepository,
    private snackBarErrorService: SnackBarErrorService
  ) {
    
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }
  submit() {
    this.studyCourseService.create$({ 
      name: this.courseForm.controls.name.value!, 
      shortName: this.courseForm.controls.shortName.value!, 
    }).subscribe({
      next: (courseResponse) => {
        this.dialogRef.close({displayText: courseResponse.name, id: courseResponse.id} as SelectValue);
      },
      error: (err) => {
        this.snackBarErrorService.open(err);
        this.courseForm.setErrors({'incorrect': true})
      }
    })
  }
}
