import { Routes } from '@angular/router';
import { PasodoblesListComponent } from './components/pasodobles-list/pasodobles-list.component';
import { PasodobleDetailComponent } from './components/pasodoble-detail/pasodoble-detail.component';
import { AuthorsListComponent } from './components/authors-list/authors-list.component';
import { AuthorDetailComponent } from './components/author-detail/author-detail.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminPasodoblesListComponent } from './components/admin/pasodobles-list/pasodobles-list.component';
import { AdminPasodobleFormComponent } from './components/admin/pasodoble-form/pasodoble-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CurrentUserComponent } from './components/current-user/current-user.component';

export const routes: Routes = [

    {path: '', redirectTo: 'pasodobles', pathMatch: 'full'},

    { path: 'pasodobles', component: PasodoblesListComponent },
    {path: 'pasodobles/:id',component: PasodobleDetailComponent},

    {path: 'authors/:id',component: AuthorDetailComponent },
    { path: 'authors', component: AuthorsListComponent },

    // plantilla de admin con vista de panel y de form
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children:[
            { path: '', redirectTo: 'pasodobles', pathMatch: 'full' },
            {path: 'pasodobles', component: AdminPasodoblesListComponent},
            {path: 'pasodobles/new', component: AdminPasodobleFormComponent},
            {path: 'pasodobles/edit/:id', component: AdminPasodobleFormComponent},
            // No hay ruta de borrado ya que no hay vista
        ]
    },

    // AUTH
    { path: 'auth/user', component: CurrentUserComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/logout', component: LoginComponent },

];
