import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pasodoble, FavoritesResponse, FavoriteToggleResponse } from '../models/pasodoble.interface';
import { AuthService } from '../../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PasodobleService {

  private apiUrl = 'http://pasodobles.mb/api'; 
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // not loading headers as property since PasodobleService can be
  // loaded without Authorization and evading old token keeping

  getPasodobles(): Observable<Pasodoble[]> {
    return this.http.get<Pasodoble[]>(`${this.apiUrl}/pasodobles`);
  }
  getPasodoble(id: string | null): Observable<Pasodoble> {
  return this.http.get<Pasodoble>(`${this.apiUrl}/pasodobles/${id}`);
  }

  toggleFavorite(pasodobleId: number): Observable<FavoriteToggleResponse> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<FavoriteToggleResponse>(
      `${this.apiUrl}/pasodobles/${pasodobleId}/favorite`, {}, headers
    );
  }

  getUserFavorites(): Observable< FavoritesResponse > {
    const headers = this.authService.getAuthHeaders();
    return this.http.get< FavoritesResponse >(`${this.apiUrl}/user/favorites`, headers );
  }
}