import {ChangeDetectionStrategy, Component, inject, Input, OnInit, Signal, signal} from '@angular/core';
import {Dropdown, MenuItem} from '../dropdown/dropdown';
import {AuthStore} from '../../store/authentication/authentication.store';
import {NavbarSearch} from './navbar-search/navbar-search';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LangSwitcher} from './lang-switcher/lang-switcher';

@Component({
  selector: 'app-navbar',
  imports: [Dropdown, NavbarSearch, TranslateModule, LangSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  standalone: true,
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  translate = inject(TranslateService);
  protected authStore = inject(AuthStore);
  protected router = inject(Router);
  recipes = signal<boolean>(false);
  @Input() urlLogo: string = '';
  @Input() title: string = 'navbar';
  @Input() navbarLinks: MenuItem [] = [
    {label: 'home', value: '1'},
    {label: 'link', value: '2'},
    {label: 'esempio', value: '3'}
  ]
  @Input() loginDropTitle: string = 'menu';
  @Input() loginDropItems: MenuItem[] = [
    {label: 'roba', value: '1'},
    {label: 'robetta', value: '2'},
    {label: 'robicina', value: '3'}
  ];
  @Input() loggedDropTitle: string = 'menu';
  @Input() loggedDropItems: MenuItem[] = [
    {label: 'roba', value: '1'},
    {label: 'robetta', value: '2'},
    {label: 'robicina', value: '3'}
  ];
  @Input() drop2: MenuItem[] = [
    {label: 'roba', value: '1'},
    {label: 'robetta', value: '2'},
    {label: 'robicina', value: '3'}
  ];
  @Input() hideDropdown: Signal<boolean> = signal(false);
  @Input() sub: MenuItem = {label: 'logout', value: 'logout'};

  ngOnInit(): void {
    // Imposta il valore iniziale
    this.recipes.set(this.router.url === '/recipes');

    // Aggiorna il valore ad ogni cambio di rotta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.recipes.set(
          event.urlAfterRedirects.startsWith('/recipes')
          && event.urlAfterRedirects != '/recipes/new'
        );
      });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
  get currentLang() {
    return this.translate.currentLang;
  }
}
