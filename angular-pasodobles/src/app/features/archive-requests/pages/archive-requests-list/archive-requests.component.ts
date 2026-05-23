import { Component, inject, OnInit } from '@angular/core';
import { ArchiveRequestsService } from '../../services/archive-requests.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ArchiveRequests, ArchiveRequestsResponse } from '../../model/archive-requests.interface';
import { AuthService } from '../../../../auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-archive-requests',
  imports: [NgClass, RouterLink],
  templateUrl: './archive-requests.component.html',
  styleUrl: './archive-requests.scss',
  standalone: true,
})
export class ArchiveRequestsComponent implements OnInit{

  private archiveRequestService = inject(ArchiveRequestsService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  

  archiveRequests: ArchiveRequests [] = [];
  isLoading: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
  this.authService.currentUser$.subscribe({
    next: (user) => {
      this.isAdmin = user?.role === 'admin';

      if (this.isAdmin) {
        this.loadAdminArchiveRequests();
      } else {
        this.loadArchiveRequests();
      }
    }
  });
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
