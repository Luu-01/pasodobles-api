import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RehearsalPayload } from '../../../../rehearsals/models/rehearsal.interface';
import { RehearsalService } from '../../../../rehearsals/services/rehearsal.service';

@Component({
  selector: 'app-rehearsal-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './rehearsals-form.component.html',
  styleUrl: './rehearsals-form.component.scss',
})
export class AdminRehearsalFormComponent implements OnInit {
  private readonly rehearsalService = inject(RehearsalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  rehearsalForm = new FormGroup({
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    details: new FormControl<string | null>(null, [Validators.maxLength(5000)]),
  });

  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  rehearsalId: string | null = null;

  ngOnInit(): void {
    this.rehearsalId = this.route.snapshot.paramMap.get('id');

    if (this.rehearsalId) {
      this.isEditMode = true;
      this.loadRehearsal(this.rehearsalId);
    }
  }

  loadRehearsal(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.rehearsalService.getRehearsal(id).subscribe({
      next: (response) => {
        this.rehearsalForm.patchValue({
          date: this.normalizeDate(response.data.date),
          details: response.data.details,
        });

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading rehearsal', error);
        this.errorMessage = 'No se pudo cargar el ensayo.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  save(): void {
    if (this.rehearsalForm.invalid) {
      this.rehearsalForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: RehearsalPayload = {
      date: this.normalizeDate(this.rehearsalForm.controls.date.value),
      details: this.rehearsalForm.controls.details.value,
    };

    if (this.isEditMode && this.rehearsalId) {
      this.rehearsalService.updateRehearsal(this.rehearsalId, payload).subscribe({
        next: () => this.router.navigate(['/admin/rehearsals']),
        error: (error: HttpErrorResponse) => {
          console.error('Error updating rehearsal', error);
          this.errorMessage = this.getRehearsalErrorMessage(error, 'No se pudo actualizar el ensayo.');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });

      return;
    }

    this.rehearsalService.createRehearsal(payload).subscribe({
      next: () => this.router.navigate(['/admin/rehearsals']),
      error: (error: HttpErrorResponse) => {
        console.error('Error creating rehearsal', error);
        this.errorMessage = this.getRehearsalErrorMessage(error, 'No se pudo crear el ensayo.');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  isInvalid(controlName: 'date' | 'details'): boolean {
    const control = this.rehearsalForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private normalizeDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    return value.includes('T') ? value.split('T')[0] : value.substring(0, 10);
  }

  private getRehearsalErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (error.status === 422) {
      const errors = error.error?.errors as Record<string, string[]> | undefined;
      const firstValidationError = errors ? Object.values(errors).flat()[0] : null;

      return firstValidationError || error.error?.message || 'Revisa los datos del ensayo.';
    }

    return error.error?.message || fallback;
  }
}
