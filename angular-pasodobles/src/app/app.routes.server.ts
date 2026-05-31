import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pasodobles/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'authors/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'archive-requests/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/pasodobles/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/compositores/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/authors/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/archive-requests/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/rehearsals/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
