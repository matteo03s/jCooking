import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equivalence {
  ingredient: string;
  quantity: string;
  substitute: string;
  substituteQuantity: string;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class EquivalencesService {
  private http = inject(HttpClient);

  getEquivalences(lang: string): Observable<Equivalence[]> {
    const url = `/assets/data/equivalences_${lang}.json`;
    return this.http.get<Equivalence[]>(url);
  }
}
