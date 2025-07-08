import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserRepositoryService } from '../../../services/user/userRepository.service';
import { PreferencesComponent } from '../preferences.component';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from '../../../services/snackBarService';
import { PasswordValidationHelper } from '../../../helpers/passwordValidationHelper';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control &&  control.valid && (control.dirty || control.touched) && form?.hasError('passwordMismatch'));
  }
}

@Component({
  selector: 'app-password-update',
  imports: [
    MatFormFieldModule, ReactiveFormsModule, MatLabel, MatInputModule,
    MatTooltipModule, MatButtonModule, CommonModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ],
  templateUrl: './password-update.component.html',
  styleUrl: './password-update.component.scss'
})
export class PasswordUpdateComponent {
  matcher = new MyErrorStateMatcher();
  prefForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
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
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<PreferencesComponent>
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit() {
    this.userRepository.updatePassword$({
      currentPassword: this.prefForm.controls.currentPassword.value!, 
      newPassword: this.prefForm.controls.newPassword.value!
    }).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBarService.openError(err);
        this.prefForm.setErrors({'incorrect': true})
      }
    })
  }
}
