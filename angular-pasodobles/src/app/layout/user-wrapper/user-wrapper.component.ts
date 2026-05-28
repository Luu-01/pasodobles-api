import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-wrapper',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, RouterOutlet],
  templateUrl: './user-wrapper.component.html',
  styleUrl: './user-wrapper.component.scss',
})
export class UserWrapperComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe();
  }
}
