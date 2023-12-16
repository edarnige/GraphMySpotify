import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Make sure to import FormsModule


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  openPopup = false;
  email = '';
  password = '';

  constructor(private cdr: ChangeDetectorRef) {}


  openForm() {
    this.openPopup = true;
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  
  closeForm() {
    this.openPopup = false;
  }

  loginFormSubmit() {
    // Handle form submission logic here
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // Add your authentication logic or API calls here
  }

}
