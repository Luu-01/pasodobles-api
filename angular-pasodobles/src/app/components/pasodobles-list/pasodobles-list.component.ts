import { Component, OnInit, inject } from '@angular/core';
import { PasodobleService } from '../../pasodoble.service';
import { RouterLink } from '@angular/router';
import { Pasodoble } from '../../pasodoble.interface';

@Component({
  imports: [RouterLink],
  selector: 'app-pasodobles-list',
  standalone: true,
  templateUrl: './pasodobles-list.component.html'
})
export class PasodoblesListComponent implements OnInit {
  pasodobles: Pasodoble[] = [];
  private pasodobleService = inject(PasodobleService);

  ngOnInit(): void {
    this.pasodobleService.getPasodobles().subscribe((response: any) => {
      this.pasodobles = response.data; 
    });
  }
}