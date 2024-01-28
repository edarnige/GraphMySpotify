import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { SpotifyPlaylists, SpotifyPlaylistItem } from '../models/playlist.model';


@Injectable({
  providedIn: 'root'
})
export class SearchPlaylistService {
  private spotifyApiUrl = 'https://api.spotify.com/v1';

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) {}

  // https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
  // Get Current User's Playlists
  getUserPlaylists(): Observable<SpotifyPlaylists> {
    const playlistsUrl = `${this.spotifyApiUrl}/me/playlists`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`,
    });

    return this.http.get<SpotifyPlaylists>(playlistsUrl, { headers });
  }

  // https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
  // Get Playlist Items
  getPlaylistItems(playlistId: string): Observable<SpotifyPlaylistItem[]> {
    const playlistsUrl = `${this.spotifyApiUrl}/playlists/` + playlistId + "/tracks";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`,
    });

    return this.http.get<SpotifyPlaylistItem[]>(playlistsUrl, { headers });
  }
}
