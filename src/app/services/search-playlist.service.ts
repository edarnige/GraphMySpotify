import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { SpotifyPlaylists } from '../models/playlist.model';


@Injectable({
  providedIn: 'root'
})
export class SearchPlaylistService {
  private spotifyApiUrl = 'https://api.spotify.com/v1';

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) {}

  getUserPlaylists(): Observable<SpotifyPlaylists> {
    const playlistsUrl = `${this.spotifyApiUrl}/me/playlists`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`,
    });

    return this.http.get<SpotifyPlaylists>(playlistsUrl, { headers });
  }
}
