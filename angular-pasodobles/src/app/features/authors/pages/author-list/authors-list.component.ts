import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './authors-list.component.html'
})
export class AuthorsListComponent implements OnInit {
  authors: Author[] = [];
  
  searchTerm: string = '';

  private authorService = inject(AuthorService);
  private cdr = inject(ChangeDetectorRef);
  
  ngOnInit(): void {
    this.authorService.getAuthors().subscribe({
      next: (respuesta: any) => {
        this.authors = respuesta;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar los compositores', error);
      }
    });
  }

  //~ Filtering

  get filteredAuthors(): Author[] {
    if (!this.searchTerm) {
      return this.authors;
    }
    
    return this.authors.filter(a => 
      a.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}