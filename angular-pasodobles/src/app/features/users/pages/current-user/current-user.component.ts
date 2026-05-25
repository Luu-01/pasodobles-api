import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../../auth/auth.service';
import { FavoritesResponse, Pasodoble } from '../../../pasodobles/models/pasodoble.interface';
import { ArchiveRequestsService } from '../../../archive-requests/services/archive-requests.service';
import { ArchiveRequests } from '../../../archive-requests/model/archive-requests.interface';

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
  private archiveRequestService = inject(ArchiveRequestsService);

  user?: User;
  favorites: Pasodoble[] = [];
  favoritesLoading: Boolean = false;
  archiveRequests: ArchiveRequests[] = [];
  archiveRequestsLoading: Boolean = false;

  actionLabels: Record<string, string> = {
    create: 'Crear',
    edit: 'Editar',
    delete: 'Eliminar',
  };

  targetTypeLabels: Record<string, string> = {
    pasodoble: 'Pasodoble',
    author: 'Autor',
  };

  ngOnInit(): void {
      this.user = this.userService.getUser();
      this.loadFavorites();
      this.loadArchiveRequests();
      this.cdr.markForCheck();
  }

  loadFavorites(){
    this.favoritesLoading = true;
    this.userService.getFavorites().subscribe({
      next: (response) => {
        this.favorites = response.data;
        this.favoritesLoading = false;
        this.cdr.markForCheck();
      },
      error: () =>{
        this.favoritesLoading = false;
        console.error("Error al cargar los pasodobles favoritos.");
      }
    })
    
  }

  loadArchiveRequests(){
    this.archiveRequestsLoading = true;
    this.archiveRequestService.getArchiveRequests().subscribe({
      next: (response) => {
        this.archiveRequests = response.data;
        this.archiveRequestsLoading = false;
        this.cdr.markForCheck();
      }
    })
  }
}
