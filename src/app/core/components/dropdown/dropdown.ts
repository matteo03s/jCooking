import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

export type MenuItem = {
  label: string;
  value: any;
}

@Component({
  selector: 'app-dropdown',
  imports: [
    NgClass
  ],
  templateUrl: './dropdown.html',
  standalone: true,
  styleUrl: './dropdown.scss'
})
export class Dropdown {
  @Input() title: string = 'menu';
  @Input() items: MenuItem[] = [];
  @Input() placement: 'left' | 'right' | 'bottom' | 'top' = 'bottom';
}
