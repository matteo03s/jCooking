import {Component, Input, Optional, Self} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import { MenuItem } from '../dropdown/dropdown';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './form-dropdown.html',
  styleUrls: ['./form-dropdown.scss'],

})
export class FormDropdown implements ControlValueAccessor {
  @Input() showLabel: boolean = true
  @Input() title: string = 'title';
  @Input() items: MenuItem[] = [];

  value: string | null = null;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  isDisabled = false;

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.onChange(this.value);
    this.onTouched();
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
