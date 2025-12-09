import {Component, Input} from '@angular/core';
import SpinnerComponent from '../spinner/spinner';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-submit-button',
  imports: [
    SpinnerComponent,
    TranslatePipe
  ],
  templateUrl: './submit-button.html',
  styleUrl: './submit-button.scss',
  standalone: true
})
export class SubmitButton {
  @Input({ required: true }) label!: string;
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loadingLabel: string = 'FORM.LOADING';
}
