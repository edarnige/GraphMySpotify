import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private clientId = environment.CLIENT_ID; // Spotify Developer Dashboard client ID (stored in env.ts)
  private redirectUri = 'https://edarnige.github.io/GraphMySpotify/'; // Dashboard redirect URI
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
}
