import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyErrorStateMatcher } from '../../preferences/password-update/password-update.component';
import { PasswordValidationHelper } from '../../../helpers/passwordValidationHelper';
import { UserRepositoryService } from '../../../services/user/userRepository.service';
import { SnackBarErrorService } from '../../../services/snack-bar-error-service';

@Component({
  selector: 'app-create-user',
  imports: [
    MatDialogTitle, MatDialogContent, MatFormFieldModule, ReactiveFormsModule, MatLabel, MatInputModule,
    MatTooltipModule, MatButtonModule, CommonModule, MatDialogActions,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  matcher = new MyErrorStateMatcher();

  userForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required, 
      Validators.minLength(8), 
      PasswordValidationHelper.upperCaseValidator(),
      PasswordValidationHelper.lowerCaseValidator(),
      PasswordValidationHelper.numericValidator(),
      PasswordValidationHelper.specialValidator(),
    ]),
    repeatPassword: new FormControl('', [Validators.required]),
  }, {validators: [PasswordValidationHelper.passwordMatchValidator]});

  constructor(
    private userRepository: UserRepositoryService,
    private snackBarErrorService: SnackBarErrorService,
    private dialogRef: MatDialogRef<CreateUserComponent>
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit() {
    // this.userRepository.updatePassword$({
    //   newPassword: this.userForm.controls.newPassword.value!
    // }).subscribe({
    //   next: () => {
    //     this.dialogRef.close();
    //   },
    //   error: (err) => {
    //     this.snackBarErrorService.open(err);
    //     this.userForm.setErrors({'incorrect': true})
    //   }
    // })
  }
}
