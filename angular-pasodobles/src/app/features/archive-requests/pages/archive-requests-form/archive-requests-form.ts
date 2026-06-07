import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ArchiveRequestsService } from '../../services/archive-requests.service';
import {
  ArchiveRequests,
  RequestAuthorPayload,
  RequestPasodoblePayload,
} from '../../model/archive-requests.interface';

interface ApiCollectionResponse<T> {
  data: T[];
}

interface PasodobleOption {
  id: number;
  title: string;
  description?: string | null;
  year?: number | null;
  pdf_url?: string | null;
  author_id?: number | null;
  category_id?: number | null;
  author?: AuthorOption | null;
  category?: CategoryOption | null;
}

interface AuthorOption {
  id: number;
  name: string;
  biography?: string | null;
  birth_year?: number | null;
  image_url?: string | null;
}

interface CategoryOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-archive-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './archive-requests-form.component.html',
  styleUrl: './archive-requests-form.scss',
})
export class ArchiveRequestsFormComponent implements OnInit {
  private archiveRequestsService = inject(ArchiveRequestsService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  isSubmitting = false;
  isLoadingOptions = false;
  errorMessage = '';

  pasodobles: PasodobleOption[] = [];
  authors: AuthorOption[] = [];
  categories: CategoryOption[] = [];

  requestForm = new FormGroup({
    target_type: new FormControl<ArchiveRequests['target_type']>('pasodoble', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    action: new FormControl<ArchiveRequests['action']>('create', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    target_id: new FormControl<number | null>(null),

    title: new FormControl<string>(''),
    description: new FormControl<string>(''),
    year: new FormControl<number | null>(null),
    pdf_url: new FormControl<string>(''),
    author_id: new FormControl<number | null>(null),
    category_id: new FormControl<number | null>(null),

    name: new FormControl<string>(''),
    biography: new FormControl<string>(''),
    birth_year: new FormControl<number | null>(null),
    image_url: new FormControl<string>(''),

    reason: new FormControl<string>(''),
  });

  ngOnInit(): void {
    this.loadFormOptions();
    this.listenToFormChanges();
  }

  get targetType(): ArchiveRequests['target_type'] {
    return this.requestForm.controls.target_type.value;
  }

  get action(): ArchiveRequests['action'] {
    return this.requestForm.controls.action.value;
  }

  get isPasodoble(): boolean {
    return this.targetType === 'pasodoble';
  }

  get isAuthor(): boolean {
    return this.targetType === 'author';
  }

  get isCreate(): boolean {
    return this.action === 'create';
  }

  get isEdit(): boolean {
    return this.action === 'edit';
  }

  get isDelete(): boolean {
    return this.action === 'delete';
  }

  submitRequest(): void {
    this.errorMessage = '';

    const formValue = this.requestForm.getRawValue();

    if ((formValue.action === 'edit' || formValue.action === 'delete') && !formValue.target_id) {
      this.errorMessage = 'Debes seleccionar el registro que quieres editar o eliminar.';
      return;
    }

    const requestPayload: Pick<ArchiveRequests, 'target_type' | 'target_id' | 'action' | 'payload'> = {
      target_type: formValue.target_type,
      action: formValue.action,
      target_id: formValue.action === 'create' ? null : formValue.target_id,
      payload: this.buildPayload(),
    };

    this.isSubmitting = true;

    this.archiveRequestsService.createArchiveRequest(requestPayload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/archive-requests']);
      },
      error: (error: unknown) => {
        console.error('Error creating archive request', error);
        this.errorMessage = 'No se pudo enviar la solicitud. Revisa los datos e inténtalo de nuevo.';
        this.isSubmitting = false;
      },
    });
  }

  private loadFormOptions(): void {
    this.isLoadingOptions = true;

    forkJoin({
      pasodobles: this.http.get<ApiCollectionResponse<PasodobleOption> | PasodobleOption[]>('/api/pasodobles?per_page=999'),
      authors: this.http.get<ApiCollectionResponse<AuthorOption> | AuthorOption[]>('/api/authors?per_page=999'),
      categories: this.http.get<ApiCollectionResponse<CategoryOption> | CategoryOption[]>('/api/categories?per_page=999'),
    }).subscribe({
      next: ({ pasodobles, authors, categories }) => {
        this.pasodobles = this.extractCollection(pasodobles);
        this.authors = this.extractCollection(authors);
        this.categories = this.extractCollection(categories);
        this.isLoadingOptions = false;
      },
      error: (error: unknown) => {
        console.error('Error loading archive request form options', error);
        this.errorMessage = 'No se pudieron cargar los pasodobles, autores o categorías.';
        this.isLoadingOptions = false;
      },
    });
  }

  private listenToFormChanges(): void {
    this.requestForm.controls.target_type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resetSelectionAndEditableFields();
      });

    this.requestForm.controls.action.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resetSelectionAndEditableFields();
      });

    this.requestForm.controls.target_id.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((targetId) => {
        if (!targetId || !this.isEdit) {
          return;
        }

        this.autocompleteFormForEdit(targetId);
      });
  }

  private autocompleteFormForEdit(targetId: number): void {
    if (this.isPasodoble) {
      const pasodoble = this.pasodobles.find((item) => item.id === targetId);

      if (!pasodoble) {
        return;
      }

      this.requestForm.patchValue({
        title: pasodoble.title ?? '',
        description: pasodoble.description ?? '',
        year: pasodoble.year ?? null,
        pdf_url: pasodoble.pdf_url ?? '',
        author_id: pasodoble.author_id ?? pasodoble.author?.id ?? null,
        category_id: pasodoble.category_id ?? pasodoble.category?.id ?? null,
      });

      return;
    }

    const author = this.authors.find((item) => item.id === targetId);

    if (!author) {
      return;
    }

    this.requestForm.patchValue({
      name: author.name ?? '',
      biography: author.biography ?? '',
      birth_year: author.birth_year ?? null,
      image_url: author.image_url ?? '',
    });
  }

  private resetSelectionAndEditableFields(): void {
    this.requestForm.patchValue(
      {
        target_id: null,
        title: '',
        description: '',
        year: null,
        pdf_url: '',
        author_id: null,
        category_id: null,
        name: '',
        biography: '',
        birth_year: null,
        image_url: '',
      },
      { emitEvent: false },
    );
  }

  private buildPayload(): RequestPasodoblePayload | RequestAuthorPayload {
    const formValue = this.requestForm.getRawValue();

    if (formValue.action === 'delete') {
      return {
        reason: formValue.reason || undefined,
      };
    }

    if (formValue.target_type === 'pasodoble') {
      return {
        title: formValue.title || undefined,
        description: formValue.description || undefined,
        year: formValue.year ?? undefined,
        pdf_url: formValue.pdf_url || null,
        author_id: formValue.author_id ?? null,
        category_id: formValue.category_id ?? null,
        reason: formValue.reason || undefined,
      };
    }

    return {
      name: formValue.name || undefined,
      biography: formValue.biography || undefined,
      birth_year: formValue.birth_year ?? undefined,
      image_url: formValue.image_url || null,
      reason: formValue.reason || undefined,
    };
  }

  private extractCollection<T>(response: ApiCollectionResponse<T> | T[]): T[] {
    return Array.isArray(response) ? response : response.data;
  }
}
