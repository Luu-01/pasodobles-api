import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArchiveRequestsService } from '../../services/archive-requests.service';
import {
  ArchiveRequests,
  RequestAuthorPayload,
  RequestPasodoblePayload,
} from '../../model/archive-requests.interface';

@Component({
  selector: 'app-archive-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './archive-requests-form.component.html',
  styleUrl: './archive-requests-form.scss',
})
export class ArchiveRequestsFormComponent {
  private archiveRequestsService = inject(ArchiveRequestsService);
  private router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

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
      this.errorMessage = 'Debes indicar el ID del registro que quieres editar o eliminar.';
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
      error: (error) => {
        console.error('Error creating archive request', error);
        this.errorMessage = 'No se pudo enviar la solicitud. Revisa los datos e inténtalo de nuevo.';
        this.isSubmitting = false;
      }
    });
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
}
