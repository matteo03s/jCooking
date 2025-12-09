import {Pipe, PipeTransform} from '@angular/core';
import {UnitEnum} from '../store/recipe/enum/UnitEnum';

@Pipe({
  name: 'unitEnumLabel',
  standalone: true,
})
export class UnitEnumLabelPipe implements PipeTransform {

  transform(value: UnitEnum | string): string {
    if (!value) {
      return '';
    }
    const label = UnitEnum[value as keyof typeof UnitEnum];
    return label || value;
  }
}
