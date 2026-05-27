import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ExternalPasodobleResult } from '../../models/external-pasodoble-result.interface';
import { ExternalPasodobleSearchService } from '../../services/external-pasodoble-search.service';

@Component({
  selector: 'app-external-pasodoble-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './external-pasodoble-search.component.html',
  styleUrl: './external-pasodoble-search.component.scss',
})
export class ExternalPasodobleSearchComponent {
  private readonly externalSearchService = inject(ExternalPasodobleSearchService);
  private readonly cdr = inject(ChangeDetectorRef);

  query = '';
  lastQuery = '';
  results: ExternalPasodobleResult[] = [];
  isLoading = false;
  errorMessage = '';

  search(): void {
    const normalizedQuery = this.query.trim();

    if (normalizedQuery.length < 2) {
      this.errorMessage = 'Introduce al menos 2 caracteres.';
      this.results = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.lastQuery = normalizedQuery;

    this.externalSearchService.search(normalizedQuery).subscribe({
      next: (response) => {
        this.results = response.data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('External MusicBrainz search failed', error);
        this.errorMessage = 'No se pudo completar la búsqueda externa.';
        this.results = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
