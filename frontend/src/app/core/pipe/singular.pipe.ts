import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'singular'})
export class SingularPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.endsWith('s') ? value.slice(0, -1) : value;
  }
}
