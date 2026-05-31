import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pasodoble, FavoritesResponse, FavoriteToggleResponse, PasodoblesResponse } from '../models/pasodoble.interface';
import { AuthService } from '../../../auth/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasodobleService {

  private apiUrl = environment.apiUrl; 
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // not loading headers as property since PasodobleService can be
  // loaded without Authorization and evading old token keeping

  getPasodobles(page = 1): Observable<PasodoblesResponse> {
    const params = new HttpParams().set('page', page);
    return this.http.get<PasodoblesResponse>(`${this.apiUrl}/pasodobles`, { params });
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

  getUserFavorites(page = 1): Observable<FavoritesResponse> {
    const headers = this.authService.getAuthHeaders();
    const params = new HttpParams().set('page', page);
    return this.http.get<FavoritesResponse>(`${this.apiUrl}/user/favorites`, { ...headers, params });
  }
}
