import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Rehearsal } from '../../../../rehearsals/models/rehearsal.interface';
import { RehearsalService } from '../../../../rehearsals/services/rehearsal.service';

@Component({
  selector: 'app-rehearsal-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rehearsals-list.component.html',
  styleUrl: './rehearsals-list.component.scss',
})
export class AdminRehearsalListComponent implements OnInit {
  private readonly rehearsalService = inject(RehearsalService);
  private readonly cdr = inject(ChangeDetectorRef);

  rehearsals: Rehearsal[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRehearsals();
  }

  loadRehearsals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // There is no backend GET /api/admin/rehearsals route.
    // The admin list reuses the authenticated user index and adds admin actions in the UI.
    this.rehearsalService.getRehearsals().subscribe({
      next: (response) => {
        this.rehearsals = response.data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading rehearsals', error);
        this.errorMessage = 'No se pudieron cargar los ensayos.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteRehearsal(rehearsal: Rehearsal): void {
    const confirmed = confirm(
      `¿Seguro que deseas eliminar el ensayo del ${rehearsal.date}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    this.rehearsalService.deleteRehearsal(rehearsal.id).subscribe({
      next: () => {
        this.rehearsals = this.rehearsals.filter((item) => item.id !== rehearsal.id);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error deleting rehearsal', error);
        this.errorMessage = 'No se pudo eliminar el ensayo.';
        this.cdr.markForCheck();
      },
    });
  }
}
