import {Component, Input} from '@angular/core';
import {AiBeverage} from '../../../core/store/aiChef/ai-beverage';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-sommelier-suggestion',
  imports: [
    TranslatePipe
  ],
  standalone: true,
  templateUrl: './sommelier-suggestion.html',
  styleUrl: './sommelier-suggestion.scss',
})
export class SommelierSuggestion {

  @Input() beverages: AiBeverage[] = [];

  getIcon(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('vino') && t.includes('rosso')) return '🍷';
    if (t.includes('vino')) return '🥂';
    if (t.includes('birra')) return '🍺';
    if (t.includes('cocktail')) return '🍸';
    if (t.includes('analcolico') || t.includes('tè') || t.includes('acqua')) return '🧃';
    return '🍹';
  }
}
