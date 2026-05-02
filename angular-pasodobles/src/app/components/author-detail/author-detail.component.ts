import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorService } from '../../author.service';
import { Author } from '../../author.interface';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './author-detail.component.html'
})
export class AuthorDetailComponent implements OnInit {
  author?: Author;
  
  private authorService = inject(AuthorService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.authorService.getAuthor(id).subscribe({
      next: (respuesta) => {
        this.author = respuesta.data;
        this.cdr.detectChanges();
      }
    });
  }
}