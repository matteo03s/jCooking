import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserJSON} from '../model/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/users'; // modifica con l'URL del tuo backend

  /** Recupera i dati dell'utente loggato */
  getMe(): Observable<UserJSON> {
    return this.http.get<UserJSON>(`${this.baseUrl}/me`);
  }

  /** Recupera i dati di un utente per id */
  getById(id: number): Observable<UserJSON> {
    return this.http.get<UserJSON>(`${this.baseUrl}/${id}`);
  }

  /** Recupera i dati di un utente per username */
  getByUsername(username: string): Observable<UserJSON> {
    return this.http.get<UserJSON>(`${this.baseUrl}/${username}`);
  }

  /** Recupera tutti gli altri utenti */
  getAll(): Observable<UserJSON[]> {
    return this.http.get<UserJSON[]>(`${this.baseUrl}`);
  }

  /** Recupera i migliori utenti (quelli con più ricette scritte) */
  getBest(): Observable<UserJSON[]> {
    return this.http.get<UserJSON[]>(`${this.baseUrl}/best`);
  }

  /** Aggiorna i dati di un utente */
  updateUser(id: number, user: UserJSON): Observable<UserJSON> {
    return this.http.put<UserJSON>(`${this.baseUrl}/${id}`, user);
  }

  /** Aggiorna la password dell'utente */
  updatePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/password`, { password: newPassword });
  }

}
