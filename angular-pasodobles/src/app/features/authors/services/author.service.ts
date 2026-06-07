import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, AuthorsResponse } from '../models/author.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/authors`; 

  getAuthors(
    page = 1,
    filters: {
      search?: string;
    } = {}
  ): Observable<AuthorsResponse> {
    let params = new HttpParams().set('page', page);

    if (filters.search?.trim()) {
      params = params.set('search', filters.search.trim());
    }

    return this.http.get<AuthorsResponse>(`${this.apiUrl}`, { params });
  }

  getAuthor(id: string | null): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }
}
