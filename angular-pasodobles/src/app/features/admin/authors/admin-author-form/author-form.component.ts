import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface AdminAuthorPayload {
  name: string | null;
  biography: string | null;
  birth_year: number | null;
  image_url: string | null;
}

@Component({
  selector: 'app-admin-author-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.scss',
})
export class AdminAuthorFormComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private baseUrl = 'http://pasodobles.mb/api';

  // This mirrors the admin pasodoble form pattern: one Reactive Form serves creation and edition.
  // The URL param decides whether the save action sends POST or PUT.
  author = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
    birth_year: new FormControl<number | null>(null, [Validators.min(1000), Validators.max(new Date().getFullYear())]),
    biography: new FormControl('', [Validators.maxLength(5000)]),
    image_url: new FormControl('', [Validators.pattern(/^https?:\/\/.+/i), Validators.maxLength(2048)]),
  });

  isEditMode: boolean = false;
  isLoading: boolean = false;
  authorId: string = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.authorId = id;
      this.loadAuthor(id);
    }
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });
  }

  loadAuthor(id: string) {
    this.http.get<AdminAuthorPayload>(`${this.baseUrl}/authors/${id}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => this.author.patchValue(data),
      error: (err) => console.error('Error obteniendo los datos del compositor', err),
    });
  }

  save() {
    if (this.author.invalid) {
      this.author.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = this.author.getRawValue();

    if (this.isEditMode) {
      this.http.put(`${this.baseUrl}/admin/authors/${this.authorId}`, payload, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.router.navigate(['/admin/compositores']);
        },
        error: (err) => {
          console.error('Error al actualizar el compositor', err);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.http.post(`${this.baseUrl}/admin/authors`, payload, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.router.navigate(['/admin/compositores']);
        },
        error: (err) => {
          console.error('Error al crear el compositor', err);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  // Same utility used in the pasodoble form: it shows errors only after interaction.
  isInvalid(controlName: string): boolean {
    const control = this.author.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
