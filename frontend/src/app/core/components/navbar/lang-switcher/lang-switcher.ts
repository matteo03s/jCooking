import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [],
  templateUrl: './lang-switcher.html',
  styleUrl: './lang-switcher.scss'
})
export class LangSwitcher {
  private translate = inject(TranslateService);

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  get currentLang() {
    return this.translate.currentLang;
  }
}
