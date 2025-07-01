import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidationHelper {
  static upperCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(value);
      return !hasUpperCase ? { passwordUpperCase: true } : null;
    };
  }

  static lowerCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasLowerCase = /[a-z]/.test(value);
      return !hasLowerCase ? { passwordLowerCase: true } : null;
    };
  }

  static numericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasNumeric = /[0-9]/.test(value);
      return !hasNumeric ? { passwordNumeric: true } : null;
    };
  }

  static specialValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return !hasSpecial ? { passwordSpecial: true } : null;
    };
  }

  static passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;

    const result = password === repeatPassword ? null : { passwordMismatch: true }
    return result;
  }
}