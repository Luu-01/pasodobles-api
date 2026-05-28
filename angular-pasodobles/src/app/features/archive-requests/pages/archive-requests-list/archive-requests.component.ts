import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ArchiveRequestsService } from '../../services/archive-requests.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { ArchiveRequests } from '../../model/archive-requests.interface';
import { AuthService } from '../../../../auth/auth.service';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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
  isLoading: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.archiveRequests = [];

          if (!user) {
            this.isAdmin = false;
            this.isLoading = false;
            this.cdr.markForCheck();
            return;
          }

          this.isAdmin = user.role === 'admin';

          if (this.isAdmin) {
            this.loadAdminArchiveRequests();
          } else {
            this.loadArchiveRequests();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadArchiveRequests(){
    this.isLoading = true;

    this.archiveRequestService.getArchiveRequests().subscribe({
      next: (response) => {
        this.archiveRequests = response.data;
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

  loadAdminArchiveRequests(){
    this.isLoading = true;
    

    this.archiveRequestService.getAdminArchiveRequests().subscribe({
      next: (response) => {
        this.archiveRequests = response.data;
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
