import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ArchiveRequestsService } from '../../services/archive-requests.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { ArchiveRequests } from '../../model/archive-requests.interface';
import { AuthService } from '../../../../auth/auth.service';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PaginationMeta } from '../../../../shared/models/pagination.interface';

@Component({
  selector: 'app-archive-requests',
  imports: [NgClass, RouterLink],
  templateUrl: './archive-requests.component.html',
  styleUrl: './archive-requests.scss',
  standalone: true,
})
export class ArchiveRequestsComponent implements OnInit, OnDestroy{

  private archiveRequestService = inject(ArchiveRequestsService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  

  archiveRequests: ArchiveRequests [] = [];
  paginationMeta: PaginationMeta | null = null;
  currentPage = 1;
  isLoading: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.archiveRequests = [];
          this.paginationMeta = null;
          this.currentPage = 1;

          if (!user) {
            this.isAdmin = false;
            this.isLoading = false;
            this.cdr.markForCheck();
            return;
          }

          this.isAdmin = user.role === 'admin';
          this.loadRequestsPage(1);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRequestsPage(page = 1): void {
    if (this.isAdmin) {
      this.loadAdminArchiveRequests(page);
    } else {
      this.loadArchiveRequests(page);
    }
  }

  goToPage(page: number): void {
    if (!this.paginationMeta || page < 1 || page > this.paginationMeta.last_page || page === this.currentPage) {
      return;
    }

    this.loadRequestsPage(page);
  }

  get pageNumbers(): number[] {
    const lastPage = this.paginationMeta?.last_page ?? 1;
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  loadArchiveRequests(page = 1): void{
    this.isLoading = true;
    this.currentPage = page;

    this.archiveRequestService.getArchiveRequests(page).subscribe({
      next: (response) => {
        this.archiveRequests = response.data;
        this.paginationMeta = response.meta;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error:() => {
        console.error("Ha habido un error cargando las solicitudes.")
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAdminArchiveRequests(page = 1): void{
    this.isLoading = true;
    this.currentPage = page;
    

    this.archiveRequestService.getAdminArchiveRequests(page).subscribe({
      next: (response) => {
        this.archiveRequests = response.data;
        this.paginationMeta = response.meta;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error:() => {
        console.error("Ha habido un error cargando las solicitudes.")
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
