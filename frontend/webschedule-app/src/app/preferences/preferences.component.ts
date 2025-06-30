import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserRepositoryService } from '../../services/user/userRepository.service';
import { SnackBarErrorService } from '../../services/snack-bar-error-service';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control &&  control.valid && (control.dirty || control.touched) && form?.hasError('notMatched'));
  }
}

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
  defaultLogin = '';
  defaultDisplayName = '';
  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,16}$/
  public matcher = new MyErrorStateMatcher();
  prefForm = new FormGroup({
    login: new FormControl(),
    displayName: new FormControl(),
    newPassword: new FormControl('', [Validators.required,  Validators.pattern(this.passwordPattern)]),
    confirmNewPassword: new FormControl('', [Validators.required,  Validators.pattern(this.passwordPattern)]),
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

  checkValidations(control:AbstractControl, type: 'special-character' | 'number' | 'lowercase' | 'uppercase' | 'length') {
    switch (type) {
      case 'special-character':
        return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(control.value);;
      case 'number':
        return /\d/.test(control.value);
      case 'lowercase':
        return /[a-z]/.test(control.value);
      case 'uppercase':
        return /[A-Z]/.test(control.value);
      case 'length':
        return control.value.length >= 8 && control.value.length <= 16;
      default:
        return false
    }
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null{
     if (
      group.get('newPassword')?.value &&
      group.get('confirmNewPassword')?.value &&
      group.get('newPassword')?.value &&
      group.get('newPassword')?.value.length >= 8 &&
      group.get('newPassword')?.value.length <= 16 &&
      group.get('confirmNewPassword')?.value.length >= 8 &&
      group.get('confirmNewPassword')?.value.length <= 16
    ) {
      return group.get('newPassword')?.value === group.get('confirmNewPassword')?.value ? null : { "notMatched": true }
    }
    return null;
  }

  onPasswordBlur() {
    if (this.prefForm.get('repeatPassword')?.value) {
      this.prefForm.updateValueAndValidity();
    }
  }
}
