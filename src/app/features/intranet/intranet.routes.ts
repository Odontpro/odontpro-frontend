import {Routes} from '@angular/router';
import {IntranetLayout} from '../../shared/layouts/intranet-layout/intranet-layout';

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
      }

    ]
  }
];
