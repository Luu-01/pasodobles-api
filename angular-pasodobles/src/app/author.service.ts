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

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }
  getAuthor(id: string | null): Observable<Author> {
  return this.http.get<Author>(`${this.apiUrl}/${id}`);
}
}