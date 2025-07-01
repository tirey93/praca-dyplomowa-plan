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
  selector: 'app-display-name-update',
  imports: [
    MatFormFieldModule, ReactiveFormsModule, MatLabel, MatInputModule,
    MatTooltipModule, MatButtonModule, CommonModule
  ],
  templateUrl: './display-name-update.component.html',
  styleUrl: './display-name-update.component.scss'
})
export class DisplayNameUpdateComponent {
submit() {
throw new Error('Method not implemented.');
}
onNoClick() {
throw new Error('Method not implemented.');
}
  defaultDisplayName = '';
  prefForm = new FormGroup({
    displayName: new FormControl()
  });

  constructor(
    userRepository: UserRepositoryService,
    private snackBarErrorService: SnackBarErrorService
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
}
