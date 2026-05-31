import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.interface';
import { FormsModule } from '@angular/forms';
import { PaginationMeta } from '../../../../shared/models/pagination.interface';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './authors-list.component.html'
})
export class AuthorsListComponent implements OnInit {
  authors: Author[] = [];
  paginationMeta: PaginationMeta | null = null;
  currentPage = 1;
  
  searchTerm: string = '';

  private authorService = inject(AuthorService);
  private cdr = inject(ChangeDetectorRef);
  
  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(page = 1): void {
    this.currentPage = page;

    this.authorService.getAuthors(page).subscribe({
      next: (response) => {
        this.authors = response.data;
        this.paginationMeta = response.meta;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar los compositores', error);
      }
    });
  }

  goToPage(page: number): void {
    if (!this.paginationMeta || page < 1 || page > this.paginationMeta.last_page || page === this.currentPage) {
      return;
    }

    this.loadAuthors(page);
  }

  get pageNumbers(): number[] {
    const lastPage = this.paginationMeta?.last_page ?? 1;
    return Array.from({ length: lastPage }, (_, index) => index + 1);
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
