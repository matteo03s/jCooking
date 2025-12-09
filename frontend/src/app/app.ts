import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Navbar} from './core/components/navbar/navbar';
import {ErrorService} from './core/errors/error.service';
import {ModalTypes} from './core/components/modal/modalTypes';
import {MenuItem} from './core/components/dropdown/dropdown';
import {AuthStore} from './core/store/authentication/authentication.store';
import {NotificationComponent} from './core/components/notification/notification';
import {UserStore} from './core/store/authentication/user.store';
import {Footer} from './core/components/footer/footer';
import {ScrollToTop} from './core/components/scroll-to-top/scroll-to-top';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, NotificationComponent, Footer, ScrollToTop],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App {
  private translate = inject(TranslateService);
  protected router = inject(Router);
  protected authStore = inject(AuthStore);
  protected userStore = inject(UserStore);
  protected errorService = inject(ErrorService);
  protected readonly title = signal('jCooking');
  protected readonly urlLogo: string = '/assets/jLogo1.png';
  token = this.authStore.tokenSignal;
  error: WritableSignal<ModalTypes> = signal('ERROR')
  getErrorDetails = () => this.errorService.errorDetails();
  isLogged = computed(() =>
    this.userStore.isLogged()
  )
  navbarLinks: MenuItem [] = [
/*    {label: 'recipes', value: 'recipes'},
    {label: 'new recipe', value: 'recipes/new'},
    {label: 'my recipes', value: 'recipes/my'},
    {label: 'esempio', value: '3'}
    {label: 'ingredients', value: 'ingredients'},
*/    { label: 'NAV.CHEFBOT', value: 'generator' },
  ]
  dropLogin: MenuItem [] = [
    { label: 'NAV.LOGIN', value: 'sign-in' },
    { label: 'NAV.SIGNUP', value: 'sign-up' }

  ];
  dropLogged: MenuItem [] = [
    { label: 'NAV.MY_ACCOUNT', value: 'users/my' },
    { label: 'NAV.LOGOUT', value: 'logout' }
  ];
  recipesDropdown: MenuItem[] = [
    { label: 'NAV.ALL_RECIPES', value: '/recipes' },
    { label: 'NAV.MY_RECIPES', value: '/recipes/my' },
    { label: 'NAV.NEW_RECIPE', value: '/recipes/new' },
    { label: 'NAV.FAVOURITES', value: '/users/my/favourites' },
    { label: 'NAV.CATEGORIES', value: '/categories' },
    { label: 'NAV.EQUIVALENCES', value: 'equivalences' }
  ];

  constructor() {
    this.authStore.init();
    this.userStore.init();
    this.translate.addLangs(['it', 'en', 'es', 'fr']);
    this.translate.setDefaultLang('it');
    const browserLang = this.translate.getBrowserLang();
    const langToUse = browserLang?.match(/it|en|es|fr/) ? browserLang : 'it';
    this.translate.use(langToUse);
  }

}
