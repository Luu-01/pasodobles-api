import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthorService } from '../../author.service';
import { Author } from '../../author.interface';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './authors-list.component.html'
})
export class AuthorsListComponent implements OnInit {
  authors: Author[] = [];
  private authorService = inject(AuthorService);

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe({
      next: (respuesta) => {
        this.authors = respuesta.data;
      },
      error: (error) => {
        console.error('Error al cargar los compositores', error);
      }
    });
  }
}