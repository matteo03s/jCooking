import { Component, Input, Optional, Self, QueryList, ViewChildren, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup, ControlValueAccessor, NgControl, Validators, FormBuilder } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {UnitEnum} from '../../store/recipe/enum/UnitEnum';
import {Ingredient} from '../../store/recipe/model/recipe';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-dynamic-map-form',
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, TranslatePipe],
  templateUrl: './dynamic-map-form.html',
  styleUrl: './dynamic-map-form.scss',
  standalone: true,
})
export class DynamicMapForm implements ControlValueAccessor, AfterViewInit {
  fb = inject(FormBuilder);

  @Input() title: string = 'Ingredients';
  @ViewChildren('inputItem') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  items = new FormArray<FormGroup>([]);

  unitsForDropdown = Object.keys(UnitEnum).map(key => ({
    key: key,
    label: UnitEnum[key as keyof typeof UnitEnum]
  }));

  private onChange: (value: Ingredient[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    if (this.inputs.length) this.inputs.first.nativeElement.focus();
  }

  writeValue(value: Ingredient[] | null): void {
    this.items.clear();
    if (value && value.length) {
      value.forEach(v => this.addItem(v));
    }
    this.validateDuplicates();
  }
  registerOnChange(fn: (value: Ingredient[]) => void): void { this.onChange = fn; this.items.valueChanges.subscribe(() => this.updateValue()); }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { isDisabled ? this.items.disable() : this.items.enable(); }


  addItem(ingredient?: Ingredient) {
    const group = this.fb.group({
      name: [ingredient?.name || '', Validators.required],
      quantity: [ingredient?.quantity || null, [Validators.required, Validators.min(0.01)]],
      unit: [ingredient?.unit || '', Validators.required]
    });
    this.items.push(group);
    this.updateValue();
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.updateValue();
  }

  private updateValue() {
    const val: Ingredient[] = this.items.controls.map(c => ({
      name: c.get('name')!.value.trim(),
      quantity: c.get('quantity')!.value,
      unit: c.get('unit')!.value
    }));
    this.onChange(val);
    this.validateDuplicates();
  }

  private validateDuplicates() {
    const names = this.items.controls.map(c => c.get('name')!.value.trim().toLowerCase());
    const duplicates = names.filter((v, i, a) => v && a.indexOf(v) !== i);

    this.items.controls.forEach(control => {
      const nameControl = control.get('name')!;
      if (duplicates.includes(nameControl.value.trim().toLowerCase())) {
        nameControl.setErrors({ ...(nameControl.errors || {}), duplicate: true });
      } else {
        const { duplicate, ...rest } = nameControl.errors || {};
        nameControl.setErrors(Object.keys(rest).length ? rest : null);
      }
    });
  }

  markAsTouched() {
    this.onTouched();
    this.ngControl?.control?.markAsTouched();
  }

  drop(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.items.controls, event.previousIndex, event.currentIndex);
    this.updateValue();
  }

  getNameControl(item: FormGroup): FormControl { return item.get('name') as FormControl; }
  getQuantityControl(item: FormGroup): FormControl { return item.get('quantity') as FormControl; }
  getUnitControl(item: FormGroup): FormControl { return item.get('unit') as FormControl; }
}
