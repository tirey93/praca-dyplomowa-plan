import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserRepositoryService } from '../../services/user/userRepository.service';
import { SnackBarErrorService } from '../../services/snack-bar-error-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preferences',
  imports: [
    MatTabsModule, MatDialogTitle, MatFormFieldModule, ReactiveFormsModule, MatLabel, MatDialogContent, MatInputModule,
    MatDialogActions, MatTooltipModule, MatButtonModule, CommonModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: {
      subscriptSizing: 'dynamic'
   }
    }
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss'
})
export class PreferencesComponent {
submit() {
throw new Error('Method not implemented.');
}
onNoClick() {
throw new Error('Method not implemented.');
}
  test() {
    console.log(this.prefForm.hasError('passwordMismatch'));
  }
  defaultLogin = '';
  defaultDisplayName = '';
  prefForm = new FormGroup({
    login: new FormControl(),
    displayName: new FormControl(),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]),
    repeatPassword: new FormControl('', [Validators.required]),
  }, {validators: [this.passwordMatchValidator]});
  

  constructor(
    userRepository: UserRepositoryService,
    private snackBarErrorService: SnackBarErrorService
  ) {
    userRepository.getLoggedIn$().subscribe({
      next: (response) => {
        this.defaultLogin = response.name;
        this.defaultDisplayName = response.displayName;
        this.prefForm.controls.login.setValue(response.name)
        this.prefForm.controls.displayName.setValue(response.displayName)
      },
      error: (err) => {
        this.snackBarErrorService.open(err);
        this.prefForm.disable();
      }
    })
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;

    const result = password === repeatPassword ? null : { passwordMismatch: true }
    return result;
  }
}
