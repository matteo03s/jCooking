import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Dropdown, MenuItem} from '../dropdown/dropdown';

@Component({
  selector: 'app-navbar',
  imports: [
    Dropdown,
    RouterLink
  ],
  templateUrl: './navbar.html',
  standalone: true,
  styleUrl: './navbar.scss'
})
export class Navbar {
  @Input() urlLogo: string = '';
  @Input() title: string = 'navbar';
  @Input() navbarLinks: MenuItem [] = [
    {label: 'home', value: '1'},
    {label: 'link', value: '2'},
    {label: 'esempio', value: '3'}
  ]
  @Input() dropdownTitle: string = 'menu';
  @Input() dropdownItems: MenuItem[] = [
    {label: 'roba', value: '1'},
    {label: 'robetta', value: '2'},
    {label: 'robicina', value: '3'}
  ];
}
