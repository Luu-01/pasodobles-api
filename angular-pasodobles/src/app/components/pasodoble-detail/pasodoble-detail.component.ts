import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PasodobleService } from '../../pasodoble.service';
import { Pasodoble } from '../../pasodoble.interface';

@Component({
  selector: 'app-pasodoble-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pasodoble-detail.component.html'
})
export class PasodobleDetailComponent implements OnInit {
  pasodoble?: Pasodoble;
  
  private pasodobleService = inject(PasodobleService);
  private route = inject(ActivatedRoute); // Para leer el ID de la URL

  ngOnInit(): void {
    // Leemos el ID de la ruta (ej: /pasodobles/3)
    const id = this.route.snapshot.paramMap.get('id');
    
    this.pasodobleService.getPasodoble(id).subscribe({
      next: (respuesta) => {
        this.pasodoble = respuesta.data;
      }
    });
  }
}