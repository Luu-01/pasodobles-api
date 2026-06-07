import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- 1. Importante para el buscador
import { environment } from '../../../../../environments/environment';
import { PaginatedResponse, PaginationMeta } from '../../../../shared/models/pagination.interface';

@Component({
  selector: 'app-pasodoble-list',
  standalone: true,
  imports: [RouterLink, FormsModule], // <-- 2. Añadirlo aquí
  templateUrl: './pasodobles-list.component.html',

})
export class AdminPasodoblesListComponent implements OnInit {
  private http = inject(HttpClient);
  
  private publicApiUrl = `${environment.apiUrl}/pasodobles`; 
  private adminApiUrl = `${environment.apiUrl}/admin/pasodobles`;
  private cdr = inject(ChangeDetectorRef);

  pasodobles: any[] = [];
  paginationMeta: PaginationMeta | null = null;
  currentPage = 1;
  isLoading: boolean = true;
  searchTerm: string = '';

  ngOnInit() {
    this.loadPasodobles();
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  loadPasodobles(page = 1) {
    this.isLoading = true;
    this.currentPage = page;

    const params = new HttpParams().set('page', page);

    this.http.get<PaginatedResponse<any>>(this.publicApiUrl, { params }).subscribe({
      next: (response) => {
        this.pasodobles = response.data;
        this.paginationMeta = response.meta;
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar la lista', err);
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (!this.paginationMeta || page < 1 || page > this.paginationMeta.last_page || page === this.currentPage) {
      return;
    }

    this.loadPasodobles(page);
  }

  get pageNumbers(): number[] {
    const lastPage = this.paginationMeta?.last_page ?? 1;
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  get filteredPasodobles() {
    if (!this.searchTerm.trim()) {
      return this.pasodobles;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.pasodobles.filter(p => 
      p.title?.toLowerCase().includes(term) || 
      p.author?.name?.toLowerCase().includes(term) ||
      p.category?.name?.toLowerCase().includes(term)
    );
  }

  deletePasodoble(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este pasodoble? Esta acción no se puede deshacer.')) {
      this.http.delete(`${this.adminApiUrl}/${id}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.pasodobles = this.pasodobles.filter(p => p.id !== id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Hubo un error al intentar borrar el registro.');
        }
      });
    }
  }
}
