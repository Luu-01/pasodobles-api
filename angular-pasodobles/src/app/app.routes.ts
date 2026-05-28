import { Routes } from '@angular/router';

import { UserWrapperComponent } from './layout/user-wrapper/user-wrapper.component';
import { AdminLayoutComponent } from './layout/admin-wrapper/admin-layout.component';

import { PasodoblesListComponent } from './features/pasodobles/pages/pasodoble-list/pasodobles-list.component';
import { PasodobleDetailComponent } from './features/pasodobles/pages/pasodoble-detail/pasodoble-detail.component';

import { AuthorsListComponent } from './features/authors/pages/author-list/authors-list.component';
import { AuthorDetailComponent } from './features/authors/pages/author-detail/author-detail.component';

import { AdminPasodoblesListComponent } from './features/admin/pasodobles/admin-pasodoble-list/pasodobles-list.component';
import { AdminPasodobleFormComponent } from './features/admin/pasodobles/admin-pasodoble-form/pasodoble-form.component';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { CurrentUserComponent } from './features/users/pages/current-user/current-user.component';

import { ArchiveRequestsComponent } from './features/archive-requests/pages/archive-requests-list/archive-requests.component';
import { ArchiveRequestsDetailComponent } from './features/archive-requests/pages/archive-requests-detail/archive-requests-detail.component';
import { ArchiveRequestsFormComponent } from './features/archive-requests/pages/archive-requests-form/archive-requests-form';

import { RehearsalsListComponent } from './features/rehearsals/pages/rehearsals-list/rehearsals-list.component';
import { AdminRehearsalFormComponent } from './features/admin/rehearsals/pages/rehearsals-form.component/rehearsals-form.component';
import { AdminRehearsalListComponent } from './features/admin/rehearsals/pages/rehearsals-list.component/rehearsals-list.component';
import { ExternalPasodobleSearchComponent } from './features/external-music/pages/external-pasodoble-search/external-pasodoble-search.component';

import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: UserWrapperComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'pasodobles', pathMatch: 'full' },
      { path: 'pasodobles', component: PasodoblesListComponent },
      { path: 'pasodobles/:id', component: PasodobleDetailComponent },
      { path: 'authors', component: AuthorsListComponent },
      { path: 'authors/:id', component: AuthorDetailComponent },
      { path: 'external-search', component: ExternalPasodobleSearchComponent },
      { path: 'archive-requests', component: ArchiveRequestsComponent},
      { path: 'archive-requests/form', component: ArchiveRequestsFormComponent },
      { path: 'archive-requests/:id', component: ArchiveRequestsDetailComponent},
      { path: 'rehearsals', component: RehearsalsListComponent },
      { path: 'auth/user', component: CurrentUserComponent },

    ],
  },

  // Auth pages stay outside UserLayout so login/register do not inherit the main app interface.
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // Admin layout owns the admin interface.
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'pasodobles', pathMatch: 'full' },
      { path: 'pasodobles', component: AdminPasodoblesListComponent },
      { path: 'pasodobles/new', component: AdminPasodobleFormComponent},
      { path: 'pasodobles/edit/:id', component: AdminPasodobleFormComponent},
      { path: 'external-search', component: ExternalPasodobleSearchComponent },

      //? admin may access through the same components as users, backend authorizes and interface is conditional
      { path: 'archive-requests', component: ArchiveRequestsComponent},
      { path: 'archive-requests/:id', component: ArchiveRequestsDetailComponent}, 

      { path: 'rehearsals', component: AdminRehearsalListComponent },
      { path: 'rehearsals/new', component: AdminRehearsalFormComponent },
      { path: 'rehearsals/edit/:id', component: AdminRehearsalFormComponent },
    ],
  },

];
