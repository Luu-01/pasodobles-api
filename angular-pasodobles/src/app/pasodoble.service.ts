import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pasodoble } from './pasodoble.interface';

@Injectable({
  providedIn: 'root'
})
export class PasodobleService {

  private apiUrl = 'http://pasodobles.mb/api/pasodobles'; 
  private http = inject(HttpClient);

  getPasodobles(): Observable<Pasodoble[]> {
    return this.http.get<Pasodoble[]>(this.apiUrl);
  }
  getPasodoble(id: string | null): Observable<{ data: Pasodoble }> {
  return this.http.get<{ data: Pasodoble }>(`${this.apiUrl}/${id}`);
}
}