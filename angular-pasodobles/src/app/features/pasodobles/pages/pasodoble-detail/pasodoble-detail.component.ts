import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PasodobleService } from '../../services/pasodoble.service';
import { Pasodoble } from '../../models/pasodoble.interface';

@Component({
  selector: 'app-pasodoble-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pasodoble-detail.component.html'
})
export class PasodobleDetailComponent implements OnInit {
  pasodoble?: Pasodoble;
  
  private pasodobleService = inject(PasodobleService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.pasodobleService.getPasodoble(id).subscribe({
      next: (response) => {
        this.pasodoble = response;
        this.cdr.detectChanges();
      }
    });
  }
}