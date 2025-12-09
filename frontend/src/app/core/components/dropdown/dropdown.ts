import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

export type MenuItem = {
  label: string;
  value: any;
}

@Component({
  selector: 'app-dropdown',
  imports: [
    NgClass,
    TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown.html',
  standalone: true,
  styleUrl: './dropdown.scss'
})
export class Dropdown {
  @Input() title: string = 'menu';
  @Input() items: MenuItem[] = [];
  @Input() placement: 'left' | 'right' | 'bottom' | 'top' = 'bottom';

}
