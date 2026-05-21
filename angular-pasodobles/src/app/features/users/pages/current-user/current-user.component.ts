import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { FavoritesResponse, Pasodoble } from '../../../pasodobles/models/pasodoble.interface';

@Component({
  selector: 'app-current-user',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './current-user.component.html',
  styleUrl: './current-user.scss',
})
export class CurrentUserComponent implements OnInit{
  private userService = inject(UserService);
  public authService = inject(AuthService);
  private cdr= inject(ChangeDetectorRef);

  user?: User;
  favorites: Pasodoble[] = [];
  favoritesLoading: Boolean = false;

  ngOnInit(): void {

    this.userService.getUser().subscribe({
      next: (response) => {
        this.user = response;
        this.loadFavorites();
      },
    });
  }

  loadFavorites(){
    this.favoritesLoading = true;
    this.userService.getFavorites().subscribe({
      next: (response) => {
        this.favorites = response.data;
        this.favoritesLoading = false;
        this.cdr.detectChanges();
      },
      error: () =>{
        this.favoritesLoading = false;
        console.error("Error al cargar los pasodobles favoritos.");
      }
    })
    
  }
}
