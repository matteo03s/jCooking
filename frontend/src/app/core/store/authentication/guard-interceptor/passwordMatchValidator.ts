import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password');
  const confirmPassword = group.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  const mismatch = password.value !== confirmPassword.value;

  if (mismatch) {
    confirmPassword.setErrors({ ...(confirmPassword.errors || {}), mismatch: true });
  } else {
    // 🔧 Se rimuovi il mismatch, mantieni eventuali altri errori
    if (confirmPassword.errors) {
      delete confirmPassword.errors['mismatch'];
      if (!Object.keys(confirmPassword.errors).length) {
        confirmPassword.setErrors(null);
      }
    }
  }

  return mismatch ? { mismatch: true } : null;
};
