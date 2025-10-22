import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-floating-textarea',
  templateUrl: './floating-textarea.html',
  standalone: true,
  styles: [`
    label {color:#457a68}
    placeholder {color:#457a68}
    textarea:focus + label {color: #457a68}
    textarea:not(:placeholder-shown) + label {color: #457a68;}
  `]
})
export class FloatingTextarea implements ControlValueAccessor {
  @Input() title = '';
  @Input() placeholder = '';

  value = '';
  disabled = false;

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
