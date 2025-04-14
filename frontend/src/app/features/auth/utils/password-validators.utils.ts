import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const isStrongPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  const errors = [];

  if (value.length < 12) errors.push("12 characters");
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\\/[\]=+;']/g.test(value)) errors.push("1 special character");
  if (!/[A-Z]/.test(value)) errors.push("1 uppercase");
  if (!/[a-z]/.test(value)) errors.push("1 lowercase");
  if (!/[0-9]/.test(value)) errors.push("1 digit");

  return errors.length ? { weakness: errors.join(", ") } : null;
};
