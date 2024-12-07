import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BudgetBalance';
  public constructor (public authService: AuthService, private router: Router) {}

  public signOut () {
    this.authService.SignOut();
    this.router.navigate(['/sign-in']);
  }
}
