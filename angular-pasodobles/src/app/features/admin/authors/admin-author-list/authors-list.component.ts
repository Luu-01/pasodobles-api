import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface AdminAuthor {
  id: number;
  name: string;
  biography?: string | null;
  birth_year?: number | null;
  image_url?: string | null;
  pasodobles?: unknown[];
}

@Component({
  selector: 'app-admin-authors-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './authors-list.component.html',
})
export class AdminAuthorsListComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private publicApiUrl = 'http://pasodobles.mb/api/authors';
  private adminApiUrl = 'http://pasodobles.mb/api/admin/authors';

  authors: AdminAuthor[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';

  ngOnInit() {
    this.loadAuthors();
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });
  }

  loadAuthors() {
    this.http.get<AdminAuthor[] | { data: AdminAuthor[] }>(this.publicApiUrl).subscribe({
      next: (response) => {
        this.authors = Array.isArray(response) ? response : response.data;
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar la lista de compositores', err);
        this.isLoading = false;
      }
    });
  }

  get filteredAuthors(): AdminAuthor[] {
    if (!this.searchTerm.trim()) {
      return this.authors;
    }

    const term = this.searchTerm.toLowerCase();
    return this.authors.filter(author =>
      author.name?.toLowerCase().includes(term) ||
      author.biography?.toLowerCase().includes(term) ||
      author.birth_year?.toString().includes(term)
    );
  }

  deleteAuthor(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este compositor? Esta acción no se puede deshacer.')) {
      this.http.delete(`${this.adminApiUrl}/${id}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.authors = this.authors.filter(author => author.id !== id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al eliminar el compositor', err);
          alert(err.error?.message || 'Hubo un error al intentar borrar el compositor.');
        }
      });
    }
  }
}
