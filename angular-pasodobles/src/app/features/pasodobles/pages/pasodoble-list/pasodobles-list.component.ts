import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pasodoble, FavoriteToggleResponse, FavoritesResponse } from '../../models/pasodoble.interface';
import { PasodobleService } from '../../services/pasodoble.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/auth.service';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  imports: [RouterLink, FormsModule, AsyncPipe, NgClass, FormsModule],
  selector: 'app-pasodobles-list',
  standalone: true,
  templateUrl: './pasodobles-list.component.html'
})
export class PasodoblesListComponent implements OnInit {
  pasodobles: Pasodoble[] = [];
  
  // Filtering
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedAuthor: string = '';

  favoriteIds = new Set<number>();
  loading = false;
  favoritesLoading = false;
  updatingFavoriteIds = new Set<number>(); // status changer to prevent multiple requests

  categories: string[] = [];
  authors: string[] = [];

  private pasodobleService = inject(PasodobleService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.pasodobleService.getPasodobles().subscribe({
      next: (response: any) => {
        this.pasodobles = response.data;
        this.extractFilterOptions();
        this.cdr.detectChanges();
        this.loadFavorites();
      },
      error: (err) => console.error(err)
    });
  }

 
  loadFavorites(): void {
    this.favoritesLoading = true;

    this.pasodobleService.getUserFavorites().subscribe({
      next: (response) => {
        this.favoriteIds = new Set(
          response.data.map((pasodoble) => pasodoble.id)
        );
        
        this.favoritesLoading = false;
        this.cdr.markForCheck(); // change
      },
      error: (error) => {
        console.error('Error loading favorites', error);
        this.favoritesLoading = false;
        this.cdr.markForCheck(); // change

      },
    });
  }

  isFavorite(pasodobleId: number): boolean {
    return this.favoriteIds.has(pasodobleId);
  }

  toggleFavorite(pasodoble: Pasodoble): void {

    // check if is already updating ( evade double-clicking )
    if (this.updatingFavoriteIds.has(pasodoble.id)) {
      return;
    }
    
    // changes temporary status to updating to disable interface button
    this.updatingFavoriteIds = new Set(this.updatingFavoriteIds).add(pasodoble.id);

    // rollback of previous status
    const wasFavorite = this.isFavorite(pasodoble.id);

    // copy of favoriteIds to modify ( instant interface update )
    const optimisticFavorites = new Set(this.favoriteIds);

    // changes status depending on the previous one ( inverted boolean logic )
      if (wasFavorite) {
        optimisticFavorites.delete(pasodoble.id);
      } else {
        optimisticFavorites.add(pasodoble.id);
      }

    // applies changes to interface
    this.favoriteIds = optimisticFavorites;

    // backend real request
      this.pasodobleService.toggleFavorite(pasodoble.id).subscribe({
        next: (response) => {
          // modify the real database if succeeded
          const confirmedFavorites = new Set(this.favoriteIds);

          if (response.is_favorite) {
            confirmedFavorites.add(pasodoble.id);
          } else {
            confirmedFavorites.delete(pasodoble.id);
          }

          this.favoriteIds = confirmedFavorites;
          // remove updating status
          this.updatingFavoriteIds.delete(pasodoble.id);
          this.cdr.markForCheck(); // change
        },
        error: (error) => {
          console.error('Error toggling favorite', error);
          // rollback if failed
          const rollbackFavorites = new Set(this.favoriteIds);

          if (wasFavorite) {
            rollbackFavorites.add(pasodoble.id);
          } else {
            rollbackFavorites.delete(pasodoble.id);
          }

          this.favoriteIds = rollbackFavorites;
          // remove updating status
          this.updatingFavoriteIds.delete(pasodoble.id);
          this.cdr.markForCheck(); // change
        },
      });
  };

   //~ Filtering
  extractFilterOptions() {

    const categoriasSet = new Set(this.pasodobles.map(p => p.category?.name).filter(Boolean));
    this.categories = Array.from(categoriasSet) as string[];

    const autoresSet = new Set(this.pasodobles.map(p => p.author?.name).filter(Boolean));
    this.authors = Array.from(autoresSet) as string[];
  }

  get filteredPasodobles(): Pasodoble[] {
    return this.pasodobles.filter(p => {
      const term = this.searchTerm.toLowerCase();
      const matchSearch = p.title.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term));
      const matchCategory = this.selectedCategory ? p.category?.name === this.selectedCategory : true;
      const matchAuthor = this.selectedAuthor ? p.author?.name === this.selectedAuthor : true;

      return matchSearch && matchCategory && matchAuthor;
    });
  }

}