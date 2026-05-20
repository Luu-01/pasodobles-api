import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { PasodobleService } from '../../pasodoble.service';
import { RouterLink } from '@angular/router';
import { Pasodoble } from '../../pasodoble.interface';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-pasodobles-list',
  standalone: true,
  templateUrl: './pasodobles-list.component.html'
})
export class PasodoblesListComponent implements OnInit {
  pasodobles: Pasodoble[] = [];
  
  // Filtering
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedAuthor: string = '';

  categories: string[] = [];
  authors: string[] = [];

  private pasodobleService = inject(PasodobleService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.pasodobleService.getPasodobles().subscribe({
      next: (response: any) => {
        this.pasodobles = response.data;
        
        this.extractFilterOptions();
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  //~ Filtering
  extractFilterOptions() {

    const categoriasSet = new Set(this.pasodobles.map(p => p.category?.name).filter(Boolean));
    this.categories = Array.from(categoriasSet) as string[];

    const autoresSet = new Set(this.pasodobles.map(p => p.author?.name).filter(Boolean));
    this.authors = Array.from(autoresSet) as string[];
  }

  get filteredPasodobles(): Pasodoble[] {
    return this.pasodobles.filter(p => {
      const term = this.searchTerm.toLowerCase();
      const matchSearch = p.title.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term));
      const matchCategory = this.selectedCategory ? p.category?.name === this.selectedCategory : true;
      const matchAuthor = this.selectedAuthor ? p.author?.name === this.selectedAuthor : true;

      return matchSearch && matchCategory && matchAuthor;
    });
  }
}