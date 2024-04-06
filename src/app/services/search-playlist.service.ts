import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { SpotifyPlaylists } from '../models/playlist.model';


@Injectable({
  providedIn: 'root'
})
export class SearchPlaylistService {
  private spotifyApiUrl: string = 'https://api.spotify.com/v1';
  private selectedPlaylist: string = '';
  selectedPlaylistSubject: Subject<string> = new Subject<string>();

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

  setSelectedPlaylist(selectedPlaylist: string){
    this.selectedPlaylist = selectedPlaylist;
    this.selectedPlaylistSubject.next(selectedPlaylist);
  }

  getSelectedPlaylist(): string {
    return this.selectedPlaylist;
  }

  // https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
  // Get Playlist Items
  getPlaylistItems(playlistId: string = this.selectedPlaylist): Observable<SpotifyPlaylists> {
    const playlistsUrl = `${this.spotifyApiUrl}/playlists/` + playlistId + "/tracks";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`,
    });

    return this.http.get<SpotifyPlaylists>(playlistsUrl, { headers });
  }

  // Get next page of playlist items
  fetchNextItems(nextUrl: string): Observable<SpotifyPlaylists> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`,
    });
    return this.http.get<SpotifyPlaylists>(nextUrl, { headers });
  }
}
