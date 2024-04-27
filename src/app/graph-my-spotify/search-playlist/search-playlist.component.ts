import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { SpotifyPlaylistItem } from '../../models/playlist.model'
import { SearchPlaylistService } from '../../services/search-playlist.service';


@Component({
  selector: 'app-search-playlist',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule
  ],
  templateUrl: './search-playlist.component.html',
  styleUrl: './search-playlist.component.scss'
})
export class SearchPlaylistComponent implements OnInit {
  playlists: SpotifyPlaylistItem[] = [];
  selectedPlaylist: string = '';

  constructor(
    private searchPlaylistService: SearchPlaylistService,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    this.searchPlaylistService.getUserPlaylists().subscribe(
      (playlists) => {
        this.playlists = playlists.items;
      },
      (error) => {
        console.error('Error getting playlists:', error);
      }
    );
  }
  
  submitPlaylist() {
    this.selectedPlaylist = this.selectedPlaylist.replace("https://open.spotify.com/playlist/","");
    this.selectedPlaylist = this.selectedPlaylist.replace(/\?si=.*/,"");
    this.searchPlaylistService.setSelectedPlaylist(this.selectedPlaylist);
  }

  get hasAccessToken(): boolean {
    return this.loginService.getToken() !== '';
  }
}
