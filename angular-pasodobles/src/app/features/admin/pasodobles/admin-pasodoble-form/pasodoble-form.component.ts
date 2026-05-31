import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-pasodoble-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pasodoble-form.component.html',
  styleUrl: './pasodoble-form.component.scss',
})
export class AdminPasodobleFormComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private baseUrl = environment.apiUrl; 

  // Modelo de datos con FormGroup
  pasodoble = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
    year: new FormControl(null, [Validators.required, Validators.min(1800),Validators.max(new Date().getFullYear())]),
    description: new FormControl('', [Validators.maxLength(300)]),
    pdf_url: new FormControl('', [Validators.pattern(/^https?:\/\/.+\.pdf$/i)]),
    author_id: new FormControl('', [Validators.required]),
    category_id: new FormControl('', [Validators.required])
  });
  
  authors: any[] = [];
  categories: any[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;
  pasdobleId: string = '';

  ngOnInit() {
    this.loadAuthors();
    this.loadCategories();
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

  loadCategories() {
    this.http.get<any[]>(`${this.baseUrl}/categories`).subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error cargando categorias', err)
    });
  }

  loadPasodoble(id: string) {
    this.http.get<any>(`${this.baseUrl}/pasodobles/${id}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => this.pasodoble.patchValue(data), // uso de ReactiveFormsModule
      error: (err) => console.error('Error obteniendo los datos del pasodoble', err)
    });
  }

  save() {

    if(this.pasodoble.invalid){
      this.pasodoble.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = this.pasodoble.getRawValue(); // datos del formulario
    
    if (this.isEditMode) {
      this.http.put(`${this.baseUrl}/admin/pasodobles/${this.pasdobleId}`, payload, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.router.navigate(['/admin/pasodobles']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.isLoading = false;
          this.cdr.markForCheck();
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
          this.cdr.markForCheck();          
        }
      });
    }
  }

  // checks whether is invalid as if the field was touched
  
  isInvalid(controlName: string): boolean {
    const control = this.pasodoble.get(controlName);
    // \!! verifies that control exists, it may be null
    return !!control && control.invalid && (control.touched || control.dirty);
  }

}
