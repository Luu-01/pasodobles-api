import { Routes } from '@angular/router';
import { PasodoblesListComponent } from './components/pasodobles-list/pasodobles-list.component';

export const routes: Routes = [
    // redirección a url /pasodobles y paso de componente a la ruta nueva
    {path: '', redirectTo: 'pasodobles', pathMatch: 'full'},
    { path: 'pasodobles', component: PasodoblesListComponent },
];
