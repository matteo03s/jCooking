import { Component, computed, effect, inject, Input, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeStore } from '../../../core/store/recipe/recipe.store';
import SpinnerComponent from '../../../core/components/spinner/spinner';
import { UserStore } from '../../../core/store/authentication/user.store';
import { DecimalPipe } from '@angular/common';
import { ConfirmModalComponent } from '../../../core/components/modal-component/modal-component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UnitEnum } from '../../../core/store/recipe/enum/UnitEnum';
import { UnitEnumLabelPipe } from '../../../core/pipe/UnitEnumLabel.pipe';
import { ImageCarousel } from './image-carousel/image-carousel';
import { Recipe } from '../../../core/store/recipe/model/recipe';
import { AiChefStore } from '../../../core/store/aiChef/aiChef.store';
import { SommelierSuggestion } from '../../ai-chef/sommelier-suggestion/sommelier-suggestion';
import { NutritionCard } from '../../ai-chef/nutrition-card/nutrition-card';
import { LevelEnumPipe } from '../../../core/pipe/levelEnumPipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {toSignal} from '@angular/core/rxjs-interop'; // IMPORTANTE: TranslateModule (contiene la pipe) e Service

@Component({
  selector: 'app-recipe-details',
  imports: [
    SpinnerComponent,
    RouterLink,
    DecimalPipe,
    UnitEnumLabelPipe,
    ImageCarousel,
    SommelierSuggestion,
    NutritionCard,
    LevelEnumPipe,
    TranslateModule // Importa il modulo completo
  ],
  templateUrl: './recipe-details.html',
  standalone: true,
  styleUrls: [
    './recipe-details.scss',
    '../details.scss'
  ]
})
export default class RecipeDetails implements OnInit, OnDestroy {

  // INJECTIONS
  private modalService = inject(BsModalService);
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);

  // STORES
  recipeStore = inject(RecipeStore);
  userStore = inject(UserStore);
  aiStore = inject(AiChefStore);

  // INPUTS
  @Input() externalRecipe?: Recipe | null;
  @Input() isDraft: boolean = false;

  // VARIABILI STATO
  recipeId!: number;
  originalServings = 1;
  currentServings = 1;
  removable: boolean = false;
  protected readonly UnitEnum = UnitEnum;

  // LINGUE DISPONIBILI
  // Aggiunto 'aiName' per mappare il codice lingua al nome che Groq capisce
  languages = [
    { code: 'it', label: '🇮🇹 Originale', aiName: 'Italian' },
    { code: 'en', label: '🇬🇧 English', aiName: 'English' },
    { code: 'fr', label: '🇫🇷 Français', aiName: 'French' },
    { code: 'es', label: '🇪🇸 Español', aiName: 'Spanish' }
  ];

  currentLang = 'it';

  languageChange = toSignal(this.translateService.onLangChange);

  // Effetto che ascolta il cambio lingua GLOBALE (es. dalla Navbar)
  // e sincronizza la traduzione della ricetta.
  globalLangSyncEffect = effect(() => {
    // Leggiamo il signal (l'evento di cambio lingua)
    const langEvent = this.languageChange();

    // Se c'è un evento e la lingua è diversa da quella correntemente impostata localmente
    if (langEvent && langEvent.lang !== this.currentLang) {

      // Chiamiamo la tua logica esistente
      // Nota: untracked per evitare loop infiniti se onLanguageChange tocca altri signal
      // ma qui dovrebbe essere sicuro
      this.onLanguageChange(langEvent.lang);
    }
  });

  // COMPUTED: Gestisce se mostrare la ricetta originale o quella tradotta dall'AI
  displayRecipe = computed(() => {
    const original = this.recipe();
    const translated = this.aiStore.translatedData();


    if (this.currentLang !== 'it' && translated) {
      return {
        ...original,
        title: translated.title,
        description: translated.description,
        steps: translated.steps,
        ingredients: translated.ingredients
      };
    }
    return original;
  });

  recipe = computed(() => {
    if (this.externalRecipe) {
      return this.externalRecipe;
    }
    return this.recipeStore.recipes().find(r => r.id === this.recipeId);
  });

  recipeImages = computed(() => this.recipe()?.images ?? []);

  isAuthor = computed(() => {
    const currentUser = this.userStore.getUsername();
    return this.recipe()?.author?.username === currentUser;
  });

  // --- METHODS ---

  onLanguageChange(langCode: string) {
    if (this.currentLang === langCode) return;

    this.currentLang = langCode;

    if (this.translateService.currentLang !== langCode) {
        this.translateService.use(langCode);
    }

    if (langCode === 'it') {
      this.aiStore.clearTranslation();
    } else {
      const targetLangName = this.languages.find(l => l.code === langCode)?.aiName || 'English';

      this.aiStore.translateRecipe({
        recipe: this.recipe(),
        language: targetLangName
      });
    }
  }

  ngOnInit(): void {
    if (!this.externalRecipe) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.recipeId = +id;
          const found = this.recipeStore.recipes().some(r => r.id === this.recipeId);
          if (!found) {
            this.recipeStore.getRecipeById(this.recipeId);
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.aiStore.clearDraft();
    this.aiStore.clearSommelier();
    this.aiStore.clearNutrition();
    this.aiStore.clearTranslation();
    this.translateService.use('it');
  }

  askSommelier() {
    const r = this.displayRecipe();
    if (r) {
      const ingredientsStr = r.ingredients?.map((i:any) => i.name).join(', ') || '';
      this.aiStore.askSommelier({
        title: r.title,
        ingredients: ingredientsStr,
        category: r.category?.name || 'Generico'
      });
    }
  }

  analyzeNutrition() {
    const r = this.displayRecipe();
    if (r) {
      const ingredientsStr = r.ingredients?.map((i:any) => `${i.quantity || ''} ${i.unit || ''} ${i.name}`).join(', ') || '';
      this.aiStore.analyzeNutrition({
        title: r.title,
        ingredients: ingredientsStr,
        servings: r.servings || 1
      });
    }
  }

  loadServingsEffect = effect(() => {
    const r = this.recipe();
    if (r) {
      this.originalServings = r.servings;
      this.currentServings = r.servings;
    }
  });

  openModal(recipeId: number) {
    const modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Elimina ricetta',
        message: 'Sei sicuro di voler eliminare questa ricetta?'
      },
      backdrop: 'static',
      class: 'modal-md'
    });

    modalRef.content?.confirm.subscribe(() => {
      this.recipeStore.deleteRecipe(recipeId);
    });
  }

  scaledQuantity(q: number) {
    return q * (this.currentServings / this.originalServings);
  }

  increaseServings() { this.currentServings++; }
  decreaseServings() { if (this.currentServings > 1) this.currentServings--; }
}
