import {Component, Input} from '@angular/core';
import {AiNutrition} from '../../../core/store/aiChef/aiNutrition';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-nutrition-card',
  imports: [
    TranslatePipe
  ],
  templateUrl: './nutrition-card.html',
  styleUrl: './nutrition-card.scss',
  standalone: true
})
export class NutritionCard {
  @Input({required: true}) nutrition!: AiNutrition;

  calcPercent(val: number): number {
    return Math.min((val / 50) * 100, 100);
  }
}
