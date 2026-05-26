import { Component, inject, OnInit } from '@angular/core';
import { ArchiveRequestsService } from '../../services/archive-requests.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArchiveRequests } from '../../model/archive-requests.interface';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/auth.service';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-archive-requests',
  imports: [ KeyValuePipe ],
  templateUrl: './archive-requests-detail.component.html',
  styleUrl: './archive-requests.scss',
  standalone: true,
})
export class ArchiveRequestsDetailComponent implements OnInit{

  private archiveRequestService = inject(ArchiveRequestsService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject (ActivatedRoute);
  private authService = inject(AuthService);

  archiveRequest?: ArchiveRequests;
  isLoading: boolean = false;
  isAdmin = false;
  isSubmitting = false;

  reviewForm = new FormGroup({
    admin_reason: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() == 'admin';
    this.loadArchiveRequest();
  }

  loadArchiveRequest(){
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');

    this.archiveRequestService.getArchiveRequest(id).subscribe({
      next: (response) => {
        this.archiveRequest = response.data
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error:(error) => {
        console.error("Ha habido un error cargando la solicitud.")
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
  
  approveRequest(){
    if(!this.archiveRequest) return;

    // status changer
    this.isSubmitting = true;

    const reason = this.reviewForm.value.admin_reason ?? ''

    this.archiveRequestService
      .approveArchiveRequest(this.archiveRequest.id, reason)
      .subscribe({
        next: (response) => {
          this.archiveRequest = response;
          this.isSubmitting = false;
          this.reviewForm.reset();
          this.cdr.markForCheck();

        },
        error: (error) => {
          console.error('Error approving request', error);
          this.isSubmitting = false;
        }
      });
  }

  rejectRequest(){
    if(!this.archiveRequest) return;

    this.isSubmitting = true;

    const reason = this.reviewForm.value.admin_reason ?? ''

    this.archiveRequestService
      .rejectArchiveRequest(this.archiveRequest.id, reason)
      .subscribe({
        next: (response) => {
          this.archiveRequest = response;
          this.isSubmitting = false;
          this.reviewForm.reset();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error rejecting request', error);
          this.isSubmitting = false;
        }
      });
  }

  // getters

  //! no interface
  get payload(): any {
    return this.archiveRequest?.payload ?? {};
  }

  get isPasodobleRequest(): boolean {
    return this.archiveRequest?.target_type === 'pasodoble';
  }

  get isAuthorRequest(): boolean {
    return this.archiveRequest?.target_type === 'author';
  }

  get isCreateRequest(): boolean {
    return this.archiveRequest?.action === 'create';
  }

  get isEditRequest(): boolean {
    return this.archiveRequest?.action === 'edit';
  }

  get isDeleteRequest(): boolean {
    return this.archiveRequest?.action === 'delete';
  }

  get isNotManaged(): boolean{
    return this.archiveRequest?.status === 'pending';
  }

  get status(): string | undefined{
    return this.archiveRequest?.status;
  }

  // payload toString

  getPayloadValue(key: string): string {
    const value = this.payload[key];

    if (value === null || value === undefined || value === '') {
      return 'No especificado';
    }

    return String(value);
  }


}
