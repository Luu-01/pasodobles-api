import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

interface AuthorOption {
  id: number;
  name: string;
}

interface CategoryOption {
  id: number;
  name: string;
}

interface PasodobleItem {
  id: number;
  title: string;
  year: number | string | null;
  description: string | null;
  pdf_url: string | null;
  author_id?: number | string | null;
  category_id?: number | string | null;
  author?: AuthorOption | null;
  category?: CategoryOption | null;
}

@Component({
  selector: 'app-pasodoble-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './pasodoble-form.component.html',
  styleUrl: './pasodoble-form.component.scss',
})
export class AdminPasodobleFormComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private baseUrl = environment.apiUrl;

  pasodoble = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    }),
    year: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1800),
      Validators.max(new Date().getFullYear()),
    ]),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(300)],
    }),
    pdf_url: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.pattern(/^https?:\/\/.+\.pdf$/i)],
    }),
    author_id: new FormControl<number | null>(null, [Validators.required]),
    category_id: new FormControl<number | null>(null, [Validators.required]),
  });

  authors: AuthorOption[] = [];
  categories: CategoryOption[] = [];

  /**
   * These getters are intentionally used by the template.
   * Angular @for only accepts iterable values. If the API returns an object
   * instead of an array, these getters return [] and prevent
   * "newCollection[Symbol.iterator] is not a function".
   */
  get authorsForTemplate(): AuthorOption[] {
    return Array.isArray(this.authors) ? this.authors as AuthorOption[] : [];
  }

  get categoriesForTemplate(): CategoryOption[] {
    return Array.isArray(this.categories) ? this.categories as CategoryOption[] : [];
  }

  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  private pasodobleId: number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    this.pasodobleId = id ? Number(id) : null;

    this.loadInitialData();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  private loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      authorsResponse: this.http.get<unknown>(`${this.baseUrl}/authors?per_page=999`, {
        headers: this.getHeaders(),
      }),
      categoriesResponse: this.http.get<unknown>(`${this.baseUrl}/categories?per_page=999`, {
        headers: this.getHeaders(),
      }),
    }).subscribe({
      next: ({ authorsResponse, categoriesResponse }) => {
        this.authors = this.normalizeOptions<AuthorOption>(authorsResponse);
        this.categories = this.normalizeOptions<CategoryOption>(categoriesResponse);

        if (this.isEditMode && this.pasodobleId !== null) {
          this.loadPasodoble(this.pasodobleId);
          return;
        }

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando autores o categorías', err);
        this.errorMessage = 'No se pudieron cargar los autores o las categorías.';
        this.authors = [];
        this.categories = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private loadPasodoble(id: number): void {
    this.http
      .get<unknown>(`${this.baseUrl}/pasodobles/${id}`, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          const pasodoble = this.extractItem<PasodobleItem>(response);

          this.pasodoble.patchValue({
            title: pasodoble.title ?? '',
            year: this.toNumberOrNull(pasodoble.year),
            description: pasodoble.description ?? '',
            pdf_url: pasodoble.pdf_url ?? '',
            author_id: this.toNumberOrNull(pasodoble.author_id ?? pasodoble.author?.id),
            category_id: this.toNumberOrNull(pasodoble.category_id ?? pasodoble.category?.id),
          });

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error obteniendo los datos del pasodoble', err);
          this.errorMessage = 'No se pudieron cargar los datos del pasodoble.';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  save(): void {
    if (this.pasodoble.invalid) {
      this.pasodoble.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const rawValue = this.pasodoble.getRawValue();

    const payload = {
      ...rawValue,
      year: this.toNumberOrNull(rawValue.year),
      author_id: this.toNumberOrNull(rawValue.author_id),
      category_id: this.toNumberOrNull(rawValue.category_id),
    };

    const request$ = this.isEditMode && this.pasodobleId !== null
      ? this.http.put(`${this.baseUrl}/admin/pasodobles/${this.pasodobleId}`, payload, {
          headers: this.getHeaders(),
        })
      : this.http.post(`${this.baseUrl}/admin/pasodobles`, payload, {
          headers: this.getHeaders(),
        });

    request$.subscribe({
      next: () => {
        this.router.navigate(['/admin/pasodobles']);
      },
      error: (err) => {
        console.error('Error guardando pasodoble', err);
        this.errorMessage = this.isEditMode
          ? 'No se pudo actualizar el pasodoble.'
          : 'No se pudo crear el pasodoble.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.pasodoble.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private normalizeOptions<T extends { id: number | string; name: string }>(response: unknown): T[] {
    const list = this.extractList<Partial<T>>(response);

    return list
      .filter((item): item is Partial<T> & { id: number | string; name: string } => {
        return item !== null &&
          typeof item === 'object' &&
          'id' in item &&
          'name' in item &&
          item.id !== null &&
          item.id !== undefined &&
          item.name !== null &&
          item.name !== undefined;
      })
      .map((item) => ({
        ...item,
        id: Number(item.id),
        name: String(item.name),
      } as T));
  }

  private extractList<T>(response: unknown): T[] {
    if (Array.isArray(response)) {
      return response as T[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const record = response as Record<string, unknown>;

    if (Array.isArray(record['data'])) {
      return record['data'] as T[];
    }

    if (record['data'] && typeof record['data'] === 'object') {
      const nestedData = record['data'] as Record<string, unknown>;

      if (Array.isArray(nestedData['data'])) {
        return nestedData['data'] as T[];
      }
    }

    if (Array.isArray(record['items'])) {
      return record['items'] as T[];
    }

    if (Array.isArray(record['results'])) {
      return record['results'] as T[];
    }

    return [];
  }

  private extractItem<T>(response: unknown): T {
    if (response && typeof response === 'object') {
      const record = response as Record<string, unknown>;

      if (record['data'] && typeof record['data'] === 'object') {
        return record['data'] as T;
      }
    }

    return response as T;
  }

  private toNumberOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  trackById(index: number, item: { id: number }): number {
    return item.id;
  }
}
