import { Component } from '@angular/core';
import { SearchPlaylistComponent } from './search-playlist/search-playlist.component';

@Component({
  selector: 'app-graph-my-spotify',
  standalone: true,
  imports: [SearchPlaylistComponent],
  templateUrl: './graph-my-spotify.component.html',
  styleUrl: './graph-my-spotify.component.scss'
})
export class GraphMySpotifyComponent {

}
