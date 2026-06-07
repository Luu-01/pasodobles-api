import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { ExternalPasodobleSearchResponse } from '../models/external-pasodoble-result.interface';

@Injectable({
  providedIn: 'root',
})
export class ExternalPasodobleSearchService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  search(query: string, limit = 10): Observable<ExternalPasodobleSearchResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit);

    return this.http.get<ExternalPasodobleSearchResponse>(
      `${this.apiUrl}/external/pasodobles/search`,
      { params }
    );
  }
}
