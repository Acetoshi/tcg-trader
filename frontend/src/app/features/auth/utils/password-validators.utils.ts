import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const hasUppercase: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return value && !/[A-Z]/.test(value) ? { missingUppercase: true } : null;
};

export const hasLowercase: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return value && !/[a-z]/.test(value) ? { missingLowercase: true } : null;
};

export const hasDigit: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return value && !/[0-9]/.test(value) ? { missingDigit: true } : null;
};

export const hasSpecialChar: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return value && !/[!@#$%^&*(),.?":{}|<>_\-\\[\]=+;']/g.test(value) ? { missingSpecialChar: true } : null;
};
