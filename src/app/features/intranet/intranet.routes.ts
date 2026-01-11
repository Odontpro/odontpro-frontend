import {Routes} from '@angular/router';
import {IntranetLayout} from '../../shared/layouts/intranet-layout/intranet-layout';
import { RoleGuard} from '../../core/guards/role.guard';

export const INTRANET_ROUTES: Routes = [
  {
    path: '',
    component: IntranetLayout,
    children: [

      { path: '', redirectTo: 'agenda', pathMatch: 'full' },

      {
        path: 'agenda',
        loadComponent: () =>
          import('./agenda/agenda')
            .then(m => m.Agenda)
      },
      {
        path: 'libro-reclamaciones',
        loadComponent: () =>
          import('./complaints/complaints')
            .then(m => m.Complaints)
      },
      {
        path: 'usuarios',
        canActivate: [RoleGuard], // 1. Aplicamos la guard aquí
        data: { roles: ['ADMIN'] }, // 2. Definimos que solo el rol 'admin' puede entrar
        loadComponent: () =>
          import('./user-management/user-management')
            .then(m => m.UserManagement)
      },
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./patients/patients')
            .then(m => m.Patients)
      }

    ]
  }
];
