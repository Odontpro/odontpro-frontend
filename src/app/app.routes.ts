import { Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
import {GuestGuard} from './core/guards/guest.guard';
import {PublicLayout} from './shared/layouts/public-layout/public-layout';
import {Book} from './features/landing/book/book';

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
        path: 'libro-reclamaciones',
        loadComponent: () =>
          import('./features/landing/book/book')
            .then(m => m.Book)
      },
      {
        path: 'especialidades/cirugia',
        loadComponent: () =>
          import('./features/landing/specialties/cirugia/cirugia')
            .then(m => m.Cirugia)
      },
      {
        path: 'especialidades/endodoncia',
        loadComponent: () =>
          import('./features/landing/specialties/endodoncia/endodoncia')
            .then(m => m.Endodoncia)
      },
      {
        path: 'especialidades/implantologia',
        loadComponent: () =>
          import('./features/landing/specialties/implantologia/implantologia')
            .then(m => m.Implantologia)
      },
      {
        path: 'especialidades/odontologia-general',
        loadComponent: () =>
          import('./features/landing/specialties/odontologia-general/odontologia-general')
            .then(m => m.OdontologiaGeneral)
      },
      {
        path: 'especialidades/ortodoncia',
        loadComponent: () =>
          import('./features/landing/specialties/ortodoncia/ortodoncia')
            .then(m => m.Ortodoncia)
      },
      {
        path: 'especialidades/radiologia',
        loadComponent: () =>
          import('./features/landing/specialties/radiologia/radiologia')
            .then(m => m.Radiologia)
      },
      {
        path: 'especialidades/rehabilitacion',
        loadComponent: () =>
          import('./features/landing/specialties/rehabilitacion/rehabilitacion')
            .then(m => m.Rehabilitacion)
      },
      {
        path: 'especialidades/odontologia-estetica',
        loadComponent: () =>
          import('./features/landing/specialties/odontologia-estetica/odontologia-estetica')
            .then(m => m.OdontologiaEstetica)
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

