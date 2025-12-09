import {
  Component,
  ElementRef,
  signal,
  ViewChild,
  AfterViewInit,
  computed,
  Input,
  Optional, Self
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor } from '@angular/forms';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],

})
export class Slider implements AfterViewInit, ControlValueAccessor {
  @ViewChild('rangeInput', { static: false }) rangeInput!: ElementRef<HTMLInputElement>;

  @Input() minutes: boolean = true;
  @Input() maxValue: number = 180;
  @Input() title: string = 'title';

  // segnali per valore e offset
  value = signal(0);
  offset = signal(0);

  // metodi ControlValueAccessor
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  ngAfterViewInit() {
    this.updateOffset();
  }

  onRangeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = Number(input.value);

    this.value.set(newValue);
    this.updateOffset();

    // aggiorna il formControl
    this.onChange(newValue);
  }

  private updateOffset() {
    if (!this.rangeInput) return;
    const range = this.rangeInput.nativeElement;
    const value = Number(range.value);
    const percent = (value - Number(range.min)) / (Number(range.max) - Number(range.min));
    const offset = percent * range.offsetWidth;
    this.offset.set(offset);
  }

  // computed: calcola automaticamente ore e minuti
  equivalentValue = computed(() => {
    const total = this.value();
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    const pad = (v: number) => v.toString().padStart(2, '0');
    return `${pad(hours)}h~${pad(mins)}m`;
  });

  // --- ControlValueAccessor ---
  writeValue(value: number): void {
    if (value != null) {
      this.value.set(value);
      this.updateOffset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.rangeInput) {
      this.rangeInput.nativeElement.disabled = isDisabled;
    }
  }
}
