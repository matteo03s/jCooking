import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategoryJSON} from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/categories'

  getAllCategories() {
    return this.http.get<CategoryJSON[]>(`${this.baseUrl}`)
  }
}
