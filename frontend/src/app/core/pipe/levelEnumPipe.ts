import {Pipe, PipeTransform} from '@angular/core';
import {Level} from '../store/recipe/enum/levelEnum';

@Pipe({
  name: 'levelEnumLabel',
  standalone: true,
})
export class LevelEnumPipe implements PipeTransform {

  transform(value: Level | string | undefined): string {
    if (!value) {
      return '';
    }
    const label = Level[value as keyof typeof Level];
    return label || value;
  }
}
