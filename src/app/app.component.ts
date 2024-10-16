import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wheatherForcast';
  isLoggedIn: boolean = false; 

  constructor(private router: Router, public authService: AuthService) {}




  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
  onLogin(): void {
    this.router.navigate(['/login']); 
  }

  onSignUp(): void {
    this.router.navigate(['/register']); 
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout(); 
  }
}
