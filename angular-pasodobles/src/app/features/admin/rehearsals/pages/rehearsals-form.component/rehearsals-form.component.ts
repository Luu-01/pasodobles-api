import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RehearsalPayload } from '../../../../rehearsals/models/rehearsal.interface';
import { RehearsalService
  
 } from '../../../../rehearsals/services/rehearsal.service';
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
          date: response.data.date ?? '',
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
      date: this.rehearsalForm.controls.date.value,
      details: this.rehearsalForm.controls.details.value,
    };

    if (this.isEditMode && this.rehearsalId) {
      this.rehearsalService.updateRehearsal(this.rehearsalId, payload).subscribe({
        next: () => this.router.navigate(['/admin/rehearsals']),
        error: (error) => {
          console.error('Error updating rehearsal', error);
          this.errorMessage = 'No se pudo actualizar el ensayo.';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });

      return;
    }

    this.rehearsalService.createRehearsal(payload).subscribe({
      next: () => this.router.navigate(['/admin/rehearsals']),
      error: (error) => {
        console.error('Error creating rehearsal', error);
        this.errorMessage = 'No se pudo crear el ensayo.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  isInvalid(controlName: 'date' | 'details'): boolean {
    const control = this.rehearsalForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
