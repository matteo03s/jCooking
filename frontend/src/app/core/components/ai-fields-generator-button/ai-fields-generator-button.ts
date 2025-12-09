import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ai-fields-generator-button',
  imports: [],
  templateUrl: './ai-fields-generator-button.html',
  styleUrl: './ai-fields-generator-button.scss',
  standalone: true
})
export class AiFieldsGeneratorButton {
  @Input({ required: true }) label!: string;
  @Input() loadingLabel: string = 'Loading...';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() tooltip: string = '';
  @Output() action = new EventEmitter<void>();

  handleClick() {
    if (!this.disabled && !this.isLoading) {
      this.action.emit();
    }
  }
}
