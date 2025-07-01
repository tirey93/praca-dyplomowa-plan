import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { UserRepositoryService } from '../../../services/user/userRepository.service';
import { SnackBarErrorService } from '../../../services/snack-bar-error-service';
import { MatDialogRef } from '@angular/material/dialog';
import { PreferencesComponent } from '../preferences.component';

@Component({
  selector: 'app-login-update',
  imports: [
    MatFormFieldModule, ReactiveFormsModule, MatLabel, MatInputModule,
    MatTooltipModule, MatButtonModule, CommonModule
  ],
  templateUrl: './login-update.component.html',
  styleUrl: './login-update.component.scss'
})
export class LoginUpdateComponent {

  defaultLogin = '';
  prefForm = new FormGroup({
    login: new FormControl()
  });

  constructor(
    private userRepository: UserRepositoryService,
    private snackBarErrorService: SnackBarErrorService,
    private dialogRef: MatDialogRef<PreferencesComponent>,
  ) {
    userRepository.getLoggedIn$().subscribe({
      next: (response) => {
        this.defaultLogin = response.name;
        this.prefForm.controls.login.setValue(response.name)
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
    this.userRepository.updateLogin$({login: this.prefForm.controls.login.value}).subscribe({
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
