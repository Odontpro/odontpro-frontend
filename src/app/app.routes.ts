import { Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
import {GuestGuard} from './core/guards/guest.guard';
import {PublicLayout} from './shared/layouts/public-layout/public-layout';

export const routes: Routes = [

  {
    path: '',
    component: PublicLayout,
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing')
            .then(m => m.Landing)
      },

      {
        path: 'login',
        canActivate: [GuestGuard],
        loadChildren: () =>
          import('./features/auth/auth.routes')
            .then(m => m.AUTH_ROUTES)
      }

    ]
  },

  {
    path: 'intranet',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/intranet/intranet.routes')
        .then(m => m.INTRANET_ROUTES)
  },

  { path: '**', redirectTo: '' }
];

