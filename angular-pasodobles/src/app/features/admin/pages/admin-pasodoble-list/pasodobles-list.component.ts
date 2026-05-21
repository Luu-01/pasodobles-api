import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- 1. Importante para el buscador

@Component({
  selector: 'app-pasodoble-list',
  standalone: true,
  imports: [RouterLink, FormsModule], // <-- 2. Añadirlo aquí
  templateUrl: './pasodobles-list.component.html',

})
export class AdminPasodoblesListComponent implements OnInit {
  private http = inject(HttpClient);
  
  private publicApiUrl = 'http://pasodobles.mb/api/pasodobles'; 
  private adminApiUrl = 'http://pasodobles.mb/api/admin/pasodobles';
  private cdr = inject(ChangeDetectorRef);

  pasodobles: any[] = [];
  isLoading: boolean = true;
  
  // 3. Variable para el buscador
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

  loadPasodobles() {
    this.http.get<any>(this.publicApiUrl).subscribe({
      next: (response) => {
        this.pasodobles = response.data ? response.data : response;
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar la lista', err);
        this.isLoading = false;
      }
    });
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
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Hubo un error al intentar borrar el registro.');
        }
      });
    }
  }
}