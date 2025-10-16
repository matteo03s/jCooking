import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/navbar/navbar';
import {Dropdown, MenuItem} from './components/dropdown/dropdown';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Dropdown],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('jCooking');
  urlLogo: string = '/assets/images/logo.png';
  navbarLinks: MenuItem [] = [
    {label: 'recipes', value: 'recipes'},
    {label: 'ingredients', value: 'ingredients'},
    {label: 'esempio', value: '3'}
  ]
  dropLogin: MenuItem [] = [
    {label: 'Sign in', value: 'user/login'},
    {label: 'Sign up', value: 'user/register'},
    {label: 'Sign in as admin', value: 'admin/login'},
  ]

}
