import { Component } from '@angular/core';
import { SearchPlaylistComponent } from './search-playlist/search-playlist.component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-graph-my-spotify',
  standalone: true,
  imports: [SearchPlaylistComponent, LoginComponent],
  templateUrl: './graph-my-spotify.component.html',
  styleUrl: './graph-my-spotify.component.scss'
})
export class GraphMySpotifyComponent {

}
