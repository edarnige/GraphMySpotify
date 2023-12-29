import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private clientId = environment.CLIENT_ID; // Spotify Developer Dashboard client ID (stored in env.ts)
  private redirectUri = 'http://localhost:4200/'; // Dashboard redirect URI
  private spotifyApiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {}

  private _token: string = '';

  setToken(token: string): void {
    this._token = token;
  }

  getToken(): string {
    return this._token;
  }

  getAuthorizationUrl(): string {
    const scope = 'user-read-private user-read-email';
    const authorizationUrl = 'https://accounts.spotify.com/authorize';
    const responseType = 'token';

    return `${authorizationUrl}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=${responseType}&scope=${scope}`;
  }

  getUserPlaylists(): Observable<any> {
    const playlistsUrl = `${this.spotifyApiUrl}/me/playlists`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
    });

    return this.http.get(playlistsUrl, { headers });
  }
}
