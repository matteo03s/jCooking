import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-floating-single-line-input',
  templateUrl: './floating-single-line-input.html',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  styleUrls: ["./floating-input.scss"]
})
export class FloatingSingleLineInput implements ControlValueAccessor {
  @Input() title = '';
  @Input() placeholder = '';
  @Input() inputType = 'text';
  @Input() disabled? = false;
  @Input() readonly? = false;

  value = '';
  hide = true;
  onChange = (_: any) => {};
  onTouched = () => {};

  get inputTypeComputed(): string {
    if (this.inputType !== 'password') return this.inputType;
    return this.hide ? 'password' : 'text';
  }

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
    this.ngControl?.control?.markAsTouched();
  }

  get invalid(): boolean {
    const control = this.ngControl?.control;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  toggleVisibility(): void {
    this.hide = !this.hide;
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;
    if (!control || !this.invalid) return null;

    const errors = control.errors;

    if (errors?.['required']) {
      return 'FORM.REQUIRED';
    }
    if (errors?.['minlength']) {
      return 'FORM.MINLENGTH';
    }
    if (errors?.['maxlength']) {
      return 'FORM.MAXLENGTH.';
    }
    if (errors?.['email'] && this.inputType === 'email') {
      return 'FORM.EMAIL';
    }
    if (errors?.['pattern'] && this.inputType === 'password') {
      return 'FORM.PASSWORD';
    }
    if (errors?.['mismatch']) {
      return 'FORM.MISMATCH 🔐';
    }
    return '';
  }

}
