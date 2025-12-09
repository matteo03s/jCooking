import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FriendshipJSON} from './model/friendship';

@Injectable({providedIn: 'root'})
export class FriendshipService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/friendships';

  getFriends(): Observable<FriendshipJSON[]> {
    return this.http.get<FriendshipJSON[]>(`${this.baseUrl}/friends`);
  }

  getAllPendingRequests(): Observable<FriendshipJSON[]> {
    return this.http.get<FriendshipJSON[]>(`${this.baseUrl}/requests`);
  }

  getRequests(): Observable<FriendshipJSON[]> {
    return this.http.get<FriendshipJSON[]>(`${this.baseUrl}/received`);
  }

  getSent(): Observable<FriendshipJSON[]> {
    return this.http.get<FriendshipJSON[]>(`${this.baseUrl}/sent`);
  }

  sendRequest(receiverId: number): Observable<FriendshipJSON> {
    return this.http.post<FriendshipJSON>(`${this.baseUrl}/request/${receiverId}`, {});
  }

  respondRequest(friendshipId: number, accept: boolean): Observable<FriendshipJSON> {
    return this.http.post<FriendshipJSON>(
      `${this.baseUrl}/${friendshipId}/respond?accept=${accept}`, {}
    );
  }
}
