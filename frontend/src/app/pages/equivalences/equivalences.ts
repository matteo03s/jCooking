import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateService, LangChangeEvent, TranslatePipe} from '@ngx-translate/core'; // Importa LangChangeEvent
import { Equivalence, EquivalencesService } from '../../core/services/equivalencesService';
import { Subscription } from 'rxjs';
import {EquivalencesTable} from './equivalences-table/equivalences-table';

@Component({
  selector: 'app-equivalences',
  standalone: true,
  imports: [CommonModule, EquivalencesTable, TranslatePipe],
  templateUrl: './equivalences.html',
  styleUrls: ['./equivalences.scss']
})
export default class Equivalences implements OnInit, OnDestroy {
  private service = inject(EquivalencesService);
  private translate = inject(TranslateService);

  loading = signal(true);
  error = signal<string | null>(null);
  equivalences = signal<Equivalence[]>([]);

  private langChangeSub!: Subscription;

  ngOnInit(): void {
    // 1. Carica i dati iniziali con la lingua corrente
    this.loadData(this.translate.currentLang || this.translate.defaultLang || 'it');

    // 2. Iscriviti all'evento di cambio lingua
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadData(event.lang);
    });
  }

  // Metodo per caricare i dati
  loadData(lang: string) {
    this.loading.set(true);
    this.service.getEquivalences(lang).subscribe({
      next: data => {
        this.equivalences.set(data);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Errore nel caricamento dati.');
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy() {
    // Pulisci la sottoscrizione per evitare memory leaks
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
}
