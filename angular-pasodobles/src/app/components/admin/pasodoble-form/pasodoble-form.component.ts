import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pasodoble-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pasodoble-form.component.html',
})
export class AdminPasodobleFormComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private baseUrl = 'http://pasodobles.mb/api'; 

  // Modelo de datos con FormGroup
  pasodoble = new FormGroup({
    title: new FormControl('', Validators.required),
    year: new FormControl(''),
    description: new FormControl(''),
    pdf_url: new FormControl(''),
    author_id: new FormControl(''),
    category_id: new FormControl('')
  });
  
  authors: any[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;
  pasdobleId: string = '';

  ngOnInit() {
    this.loadAuthors();
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.loadPasodoble(id);
      this.pasdobleId = id;
    }
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  loadAuthors() {
    this.http.get<any[]>(`${this.baseUrl}/authors`).subscribe({
      next: (data) => this.authors = data,
      error: (err) => console.error('Error cargando autores', err)
    });
  }

  loadPasodoble(id: string) {
    this.http.get<any>(`${this.baseUrl}/pasodobles/${id}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => this.pasodoble.patchValue(data), // uso de ReactiveFormsModule
      error: (err) => console.error('Error obteniendo los datos del pasodoble', err)
    });
  }

  save() {
    this.isLoading = true;
    const payload = this.pasodoble.value; // datos del formulario
    
    if (this.isEditMode) {
      this.http.put(`${this.baseUrl}/admin/pasodobles/${this.pasdobleId}`, payload, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.router.navigate(['/admin/pasodobles']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.isLoading = false;
        }
      });
    } else {
      this.http.post(`${this.baseUrl}/admin/pasodobles`, payload, { headers: this.getHeaders() }).subscribe({
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
