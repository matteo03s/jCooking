import {Component, HostListener, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.html',
  imports: [
    TranslatePipe
  ],
  styleUrls: ['./rating.scss']
})
export class Rating implements ControlValueAccessor {
  @Input() max = 10;

  rating = 0;
  hovered = 0;
  focusedIndex = -1;

  onChange = (v: number) => {};
  onTouched = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get stars(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

  setRating(value: number) {
    this.rating = value;
    this.onChange(this.rating);
    this.onTouched();
  }

  enter(index: number) {
    this.hovered = index;
  }
  leave() {
    this.hovered = 0;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.focusedIndex < 0) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(this.max, this.rating + 1);
      this.setRating(next);
      this.focusedIndex = Math.min(this.max - 1, this.focusedIndex + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      const prev = Math.max(1, this.rating - 1);
      this.setRating(prev);
      this.focusedIndex = Math.max(0, this.focusedIndex - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.setRating(this.focusedIndex + 1);
    }
  }

  writeValue(value: number | null): void {
    this.rating = value ?? 0;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
