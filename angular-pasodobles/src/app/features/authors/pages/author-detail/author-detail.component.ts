import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Author } from '../../models/author.interface';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './author-detail.component.html'
})
export class AuthorDetailComponent implements OnInit {
  author?: Author;
  errorMessage = '';
  
  private authorService = inject(AuthorService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.authorService.getAuthor(id).subscribe({
      next: (response) => {
        this.author = response;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al mostrar los datos', error);
        this.errorMessage = 'No se pudo cargar el compositor.';
        this.cdr.markForCheck();
      }
    });
  }
}
