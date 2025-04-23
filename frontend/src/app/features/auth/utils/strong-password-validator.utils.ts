import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

export function strongPasswordValidatorFactory(translate: TranslateService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const errors = [];

    if (value.length < 12) errors.push(translate.instant("passwordValidation.minLength"));
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\/[\]=+;']/g.test(value))
      errors.push(translate.instant("passwordValidation.specialChar"));
    if (!/[A-Z]/.test(value)) errors.push(translate.instant("passwordValidation.uppercase"));
    if (!/[a-z]/.test(value)) errors.push(translate.instant("passwordValidation.lowercase"));
    if (!/[0-9]/.test(value)) errors.push(translate.instant("passwordValidation.digit"));

    return errors.length ? { weakness: errors.join(", ") } : null;
  };
}
