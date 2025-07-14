import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    if (value.length < 12) {
      return { error: 'Minimum length of 12 characters is required.' };
    }
    if (!/[A-Z]/.test(value)) {
      return { error: 'At least 1 uppercase letter is required.' };
    }
    if (!/[a-z]/.test(value)) {
      return { error: 'At least 1 lowercase letter is required.' };
    }
    if (!/\d/.test(value)) {
      return { error: 'At least 1 numeric character is required.' };
    }
    if (!/[\W_]/.test(value)) {
      return { error: 'At least 1 special character is required.' };
    }

    return null;
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
