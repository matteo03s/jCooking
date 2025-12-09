import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-floating-textarea',
  templateUrl: './floating-textarea.html',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  styles: [`
    $active-color: var(--floating-color, var(--color-accent));
    label {
      color: $active-color;
    }

    placeholder {
      color: $active-color;
    }

    textarea:focus + label, textarea:not(:placeholder-shown) + label {
      color: $active-color;
    }

    .form-control:not(.is-invalid):focus {
      border-color: $active-color !important;
      box-shadow: 0 0 0 0.25rem color-mix(in srgb, $active-color, transparent 75%) !important;
    }

    .form-floating > label::after {
      background-color: transparent !important;
    }
  `]
})
export class FloatingTextarea implements ControlValueAccessor {
  value = '';
  disabled = false;
  @Input() title = '';
  @Input() placeholder = '';

  onChange = (_: any) => {};
  onTouched = () => {};

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
    const input = event.target as HTMLTextAreaElement;
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
}
