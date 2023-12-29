import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  accessToken: string = '';
  playlists: any[] = [];

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    // Reset the token
    this.accessToken = '';
    this.loginService.setToken('');

    // Check if there is an access token in the URL 
    const url = window.location.href;
    const params = new URLSearchParams(url.split('#')[1]);
    this.accessToken = params.get('access_token') || '';
    if (this.accessToken !== '') {
      // Set the access token
      this.loginService.setToken(this.accessToken);
      
      // Get user playlists // use obervable instead?? 
      this.loginService.getUserPlaylists().subscribe(
      (playlists) => {
        this.playlists = playlists.items;
        console.log(this.playlists)
      },
      (error) => {
        console.error('Error getting playlists:', error);
      }
    );
    }
  }

  // Redirect user to Spotify authorization URL
  redirectToSpotifyLogin() {
    const authorizationUrl = this.loginService.getAuthorizationUrl();
    window.location.href = authorizationUrl;
    console.log('authurl', authorizationUrl);
  }
}