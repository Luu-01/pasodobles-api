import { Routes } from '@angular/router';

import { UserWrapperComponent } from './core/layout/user-wrapper/user-wrapper.component';
import { AdminLayoutComponent } from './core/layout/admin-wrapper/admin-layout.component';

import { PasodoblesListComponent } from './features/pasodobles/pages/pasodoble-list/pasodobles-list.component';
import { PasodobleDetailComponent } from './features/pasodobles/pages/pasodoble-detail/pasodoble-detail.component';

import { AuthorsListComponent } from './features/authors/pages/author-list/authors-list.component';
import { AuthorDetailComponent } from './features/authors/pages/author-detail/author-detail.component';

import { AdminPasodoblesListComponent } from './features/admin/pages/admin-pasodoble-list/pasodobles-list.component';
import { AdminPasodobleFormComponent } from './features/admin/pages/admin-pasodoble-form/pasodoble-form.component';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { CurrentUserComponent } from './features/users/pages/current-user/current-user.component';

export const routes: Routes = [
  {
    path: '',
    component: UserWrapperComponent,
    children: [
      {
        path: '',
        redirectTo: 'pasodobles',
        pathMatch: 'full',
      },
      {
        path: 'pasodobles',
        component: PasodoblesListComponent,
      },
      {
        path: 'pasodobles/:id',
        component: PasodobleDetailComponent,
      },
      {
        path: 'authors',
        component: AuthorsListComponent,
      },
      {
        path: 'authors/:id',
        component: AuthorDetailComponent,
      },
      {
        path: 'auth/user',
        component: CurrentUserComponent,
      },
    ],
  },

  // Auth pages stay outside UserLayout so login/register do not inherit the main app interface.
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: 'auth/logout',
    component: LoginComponent,
  },

  // Admin layout owns the admin interface.
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'pasodobles',
        pathMatch: 'full',
      },
      {
        path: 'pasodobles',
        component: AdminPasodoblesListComponent,
      },
      {
        path: 'pasodobles/new',
        component: AdminPasodobleFormComponent,
      },
      {
        path: 'pasodobles/edit/:id',
        component: AdminPasodobleFormComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'pasodobles',
  },
];