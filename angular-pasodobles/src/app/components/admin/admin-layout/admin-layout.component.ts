import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  public authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    console.log('Cerrando sesión...');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getUser(){
    return this.authService.getUser();
  }

}