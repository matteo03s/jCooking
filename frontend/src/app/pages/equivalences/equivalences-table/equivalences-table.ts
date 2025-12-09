import {Component, computed, Input, signal} from '@angular/core';
import {Equivalence} from '../../../core/services/equivalencesService';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-equivalences-table',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './equivalences-table.html',
  styleUrl: './equivalences-table.scss',
})
export class EquivalencesTable {
  @Input({ required: true }) data: Equivalence[] = [];
  @Input() placeholder: string = 'Search...';

  searchTerm = signal('');

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.data;

    return this.data.filter(eq =>
      eq.ingredient.toLowerCase().includes(term) ||
      eq.substitute.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
