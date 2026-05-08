import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pasodoble-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pasodoble-form.component.html',
})
export class AdminPasodobleFormComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private baseUrl = 'http://192.168.1.34/api'; 

  // Modelo de datos vacío por defecto
  pasodoble: any = {
    title: '',
    year: null,
    description: '',
    pdf_url: '',
    author_id: '',
    category_id: ''
  };
  
  authors: any[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;

  ngOnInit() {
    this.loadAuthors();
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.loadPasodoble(id);
    }
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  // Carga la lista de compositores para llenar la etiqueta <select>
  loadAuthors() {
    // Asumimos que esta ruta pública existe en Laravel para listar autores
    this.http.get<any[]>(`${this.baseUrl}/authors`).subscribe({
      next: (data) => this.authors = data,
      error: (err) => console.error('Error cargando autores', err)
    });
  }

  // Carga los datos de un pasodoble específico si estamos en modo edición
  loadPasodoble(id: string) {
    this.http.get<any>(`${this.baseUrl}/admin/pasodobles/${id}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => this.pasodoble = data,
      error: (err) => console.error('Error obteniendo los datos del pasodoble', err)
    });
  }

  // Se ejecuta al hacer click en "Guardar Pasodoble"
  onSubmit() {
    this.isLoading = true;
    
    if (this.isEditMode) {
      this.http.put(`${this.baseUrl}/admin/pasodobles/${this.pasodoble.id}`, this.pasodoble, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.router.navigate(['/admin/pasodobles']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.isLoading = false;
        }
      });
    } else {
      this.http.post(`${this.baseUrl}/admin/pasodobles`, this.pasodoble, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.router.navigate(['/admin/pasodobles']);
        },
        error: (err) => {
          console.error('Error al crear', err);
          this.isLoading = false;
        }
      });
    }
  }
}
