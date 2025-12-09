import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CredentialsJSON } from '../model/credentials';
import { UserJSON } from '../model/user';

interface JwtResponse {
  token: string;
}

interface RegisterRequest {
  credentials: CredentialsJSON;
  user: UserJSON;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/auth';

  /**
   * LOGIN - effettua l'autenticazione e ottiene il token JWT
   */
  login(credentials: CredentialsJSON): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/signin`, credentials)
      .pipe(
        catchError(err => throwError(() => err))
      );
  }

  /**
   * SIGNUP - registra utente e credenziali
   */
  register(credentials: CredentialsJSON, user: UserJSON): Observable<string> {
    const request: RegisterRequest = { credentials, user };
    return this.http.post<string>(`${this.baseUrl}/signup`, request)
      .pipe(
        catchError(err => throwError(() => err))
      );
  }

  /**
   * LOGOUT - opzionale (se vuoi invalidare sessione lato client)
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}
