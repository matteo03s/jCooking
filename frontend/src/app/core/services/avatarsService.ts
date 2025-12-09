import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarsUrl = 'assets/avatars.json';

  constructor(private http: HttpClient) {}

  getAvatars(): Observable<string[]> {
    return this.http.get<string[]>(this.avatarsUrl);
  }
}
