import { Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
import {GuestGuard} from './core/guards/guest.guard';
import {PublicLayout} from './shared/layouts/public-layout/public-layout';
import {Book} from './features/landing/book/book';
import {
  FundamentosRestauradora
} from './features/landing/specialties/odontologia-general/fundamentos-restauradora/fundamentos-restauradora';

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
        path: 'especialidades/endodoncia/fundamentos',
        loadComponent: () =>
          import('./features/landing/specialties/endodoncia/fundamentos-endodoncia/fundamentos-endodoncia')
            .then(m => m.FundamentosEndodoncia)
      },
      {
        path: 'especialidades/implantologia',
        loadComponent: () =>
          import('./features/landing/specialties/implantologia/implantologia')
            .then(m => m.Implantologia)
      },
      {
        path: 'especialidades/implantologia/fundamentos',
        loadComponent: () =>
          import('./features/landing/specialties/implantologia/fundamentos-implantologia/fundamentos-implantologia')
            .then(m => m.FundamentosImplantologia)
      },
      {
        path: 'especialidades/odontologia-restauradora',
        loadComponent: () =>
          import('./features/landing/specialties/odontologia-general/odontologia-general')
            .then(m => m.OdontologiaGeneral)
      },
      {
        path: 'especialidades/odontologia-restauradora/fundamentos',
        loadComponent: () =>
          import('./features/landing/specialties/odontologia-general/fundamentos-restauradora/fundamentos-restauradora')
            .then(m => m.FundamentosRestauradora)
      },
      {
        path: 'especialidades/ortodoncia',
        loadComponent: () =>
          import('./features/landing/specialties/ortodoncia/ortodoncia')
            .then(m => m.Ortodoncia)
      },
      {
        path: 'especialidades/ortodoncia/fundamentos',
        loadComponent: () =>
          import('./features/landing/specialties/ortodoncia/fundamentos-ortodoncia/fundamentos-ortodoncia')
            .then(m => m.FundamentosOrtodoncia)
      },
      {
        path: 'especialidades/radiologia',
        loadComponent: () =>
          import('./features/landing/specialties/radiologia/radiologia')
            .then(m => m.Radiologia)
      },
      {
        path: 'especialidades/radiologia/fundamentos',
        loadComponent: () =>
          import('./features/landing/specialties/radiologia/fundamentos-radiologia/fundamentos-radiologia')
            .then(m => m.FundamentosRadiologia)
      },
      {
        path: 'especialidades/rehabilitacion',
        loadComponent: () =>
          import('./features/landing/specialties/rehabilitacion/rehabilitacion')
            .then(m => m.Rehabilitacion)
      },
      {
        path: 'especialidades/rehabilitacion/fundamentos',
        loadComponent: () =>
          import('./features/landing/specialties/rehabilitacion/fundamentos-rehabilitacion/fundamentos-rehabilitacion')
            .then(m => m.FundamentosRehabilitacion)
      },
      {
        path: 'especialidades/odontologia-estetica',
        loadComponent: () =>
          import('./features/landing/specialties/odontologia-estetica/odontologia-estetica')
            .then(m => m.OdontologiaEstetica)
      },
      {
        path: 'especialidades/odontologia-estetica/fundamentos',
        loadComponent: () =>
          import('./features/landing/specialties/odontologia-estetica/fundamentos-estetica/fundamentos-estetica')
            .then(m => m.FundamentosEstetica)
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

