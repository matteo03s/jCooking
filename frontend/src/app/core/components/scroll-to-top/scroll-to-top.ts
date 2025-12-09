import {Component, HostListener, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-scroll-to-top',
  imports: [
    TranslatePipe
  ],
  standalone: true,
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss'
})
export class ScrollToTop {
  showToTop = signal<boolean>(false);

  constructor() {
    // Controllo iniziale (utile se la pagina è già scrollata quando il componente è montato)
    this.showToTop.set(typeof window !== 'undefined' && window.scrollY > 200);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showToTop.set(window.scrollY > 200);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
