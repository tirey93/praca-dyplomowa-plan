import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';

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
submit() {
throw new Error('Method not implemented.');
}
  matcher = new MyErrorStateMatcher();
  prefForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required, 
      Validators.minLength(8), 
      this.upperCaseValidator(),
      this.lowerCaseValidator(),
      this.numericValidator(),
      this.specialValidator(),
    ]),
    repeatPassword: new FormControl('', [Validators.required]),
  }, {validators: [this.passwordMatchValidator]});

  upperCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(value);
      return !hasUpperCase ? { passwordUpperCase: true } : null;
    };
  }

  lowerCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasLowerCase = /[a-z]/.test(value);
      return !hasLowerCase ? { passwordLowerCase: true } : null;
    };
  }

  numericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasNumeric = /[0-9]/.test(value);
      return !hasNumeric ? { passwordNumeric: true } : null;
    };
  }

  specialValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return !hasSpecial ? { passwordSpecial: true } : null;
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;

    const result = password === repeatPassword ? null : { passwordMismatch: true }
    return result;
  }
}
