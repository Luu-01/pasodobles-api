import { Routes } from '@angular/router';
import { PasodoblesListComponent } from './components/pasodobles-list/pasodobles-list.component';
import { PasodobleDetailComponent } from './components/pasodoble-detail/pasodoble-detail.component';
import { AuthorsListComponent } from './components/authors-list/authors-list.component';
import { AuthorDetailComponent } from './components/author-detail/author-detail.component';

export const routes: Routes = [
    // redirección a url /pasodobles y paso de componente a la ruta nueva
    {path: '', redirectTo: 'pasodobles', pathMatch: 'full'},

    { path: 'pasodobles', component: PasodoblesListComponent },
    {path: 'pasodobles/:id',component: PasodobleDetailComponent},

    {path: 'authors/:id',component: AuthorDetailComponent },
    { path: 'authors', component: AuthorsListComponent },
];
