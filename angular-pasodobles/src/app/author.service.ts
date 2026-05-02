import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from './author.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);

  private apiUrl = 'http://pasodobles.mb/api/authors'; 

  getAuthors(): Observable<{ data: Author[] }> {
    return this.http.get<{ data: Author[] }>(this.apiUrl);
  }
  getAuthor(id: string | null): Observable<{ data: Author }> {
  return this.http.get<{ data: Author }>(`${this.apiUrl}/${id}`);
}
}