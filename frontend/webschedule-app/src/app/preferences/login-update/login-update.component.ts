import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { UserRepositoryService } from '../../../services/user/userRepository.service';
import { SnackBarErrorService } from '../../../services/snack-bar-error-service';

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
submit() {
throw new Error('Method not implemented.');
}
onNoClick() {
throw new Error('Method not implemented.');
}
  defaultLogin = '';
  prefForm = new FormGroup({
    login: new FormControl()
  });

  constructor(
    userRepository: UserRepositoryService,
    private snackBarErrorService: SnackBarErrorService
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
}
