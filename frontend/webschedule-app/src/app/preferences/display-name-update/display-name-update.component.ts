import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { UserRepositoryService } from '../../../services/user/userRepository.service';
import { SnackBarErrorService } from '../../../services/snack-bar-error-service';
import { PreferencesComponent } from '../preferences.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-display-name-update',
  imports: [
    MatFormFieldModule, ReactiveFormsModule, MatLabel, MatInputModule,
    MatTooltipModule, MatButtonModule, CommonModule
  ],
  templateUrl: './display-name-update.component.html',
  styleUrl: './display-name-update.component.scss'
})
export class DisplayNameUpdateComponent {
  defaultDisplayName = '';
  prefForm = new FormGroup({
    displayName: new FormControl()
  });

  constructor(
    private userRepository: UserRepositoryService,
    private snackBarErrorService: SnackBarErrorService,
    private dialogRef: MatDialogRef<PreferencesComponent>,
  ) {
    userRepository.getLoggedIn$().subscribe({
      next: (response) => {
        this.defaultDisplayName = response.displayName;
        this.prefForm.controls.displayName.setValue(response.displayName)
      },
      error: (err) => {
        this.snackBarErrorService.open(err);
        this.prefForm.disable();
      }
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit() {
    this.userRepository.updateDisplayName$({displayName: this.prefForm.controls.displayName.value}).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBarErrorService.open(err);
        this.prefForm.setErrors({'incorrect': true})
      }
    })
  }
}
