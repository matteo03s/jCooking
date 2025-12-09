import { Component, Input, Optional, Self, QueryList, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {SingularPipe} from '../../pipe/singular.pipe';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-list-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, SingularPipe, TranslatePipe],
  templateUrl: './dynamic-list-form.html',
  styleUrls: ['./dynamic-list-form.scss']
})
export class DynamicListFormComponent implements ControlValueAccessor, AfterViewInit {
  @Input() title: string = 'Title';
  @ViewChildren('inputItem') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  items = new FormArray<FormControl<string | null>>([]);

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterViewInit(): void {
    // opzionale: focus automatico sul primo input quando il componente si carica
    if (this.inputs.length) {
      this.inputs.first.nativeElement.focus();
    }
  }

  writeValue(items: string[] | null): void {
    this.items.clear();
    if (items && items.length > 0) {
      items.forEach(item => this.items.push(new FormControl(item)));
    } else {
      this.addItem();
    }
    this.validateDuplicates();
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
    this.items.valueChanges.subscribe(() => {
      this.validateDuplicates();
      const allValues = this.items.controls.map(c => c.value?.trim() || '');
      this.onChange(allValues);
    });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.items.disable() : this.items.enable();
  }

  addItem(value: string = '') {
    this.items.push(new FormControl(value));
    this.validateDuplicates();
    this.items.updateValueAndValidity();
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.validateDuplicates();
      this.items.updateValueAndValidity();
    }
  }

  onKey(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const trimmed = input.value.trim();

    if (event.key === 'Enter') {
      event.preventDefault();
      if (trimmed) this.items.at(index).setValue(trimmed);

      if (index === this.items.length - 1 && trimmed) {
        this.addItem();
        setTimeout(() => this.focusLastInput(), 0);
      } else {
        this.focusNextInput(index);
      }

      this.validateDuplicates();
      this.items.updateValueAndValidity();
    }
  }

  private focusNextInput(index: number) {
    const inputArray = this.inputs.toArray();
    if (inputArray[index + 1]) inputArray[index + 1].nativeElement.focus();
  }

  private focusLastInput() {
    const inputArray = this.inputs.toArray();
    if (inputArray.length) inputArray[inputArray.length - 1].nativeElement.focus();
  }

  private validateDuplicates() {
    const values = this.items.controls.map(c => c.value?.trim().toLowerCase() || '');
    const duplicates = values.filter((v, i, arr) => v && arr.indexOf(v) !== i);

    this.items.controls.forEach(control => {
      if (control.value && duplicates.includes(control.value.trim().toLowerCase())) {
        control.setErrors({ ...(control.errors || {}), duplicate: true });
      } else if (control.errors?.['duplicate']) {
        const { duplicate, ...rest } = control.errors;
        control.setErrors(Object.keys(rest).length ? rest : null);
      }
    });
  }

  markAsTouched() {
    this.onTouched();
    this.ngControl?.control?.markAsTouched();
  }
  drop(event: CdkDragDrop<FormControl<string | null>[]>) {
    moveItemInArray(this.items.controls, event.previousIndex, event.currentIndex);
    this.validateDuplicates();
    this.items.updateValueAndValidity();
  }
}
