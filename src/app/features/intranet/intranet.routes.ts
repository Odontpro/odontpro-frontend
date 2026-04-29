import {Routes} from '@angular/router';
import {IntranetLayout} from '../../shared/layouts/intranet-layout/intranet-layout';
import { RoleGuard} from '../../core/guards/role.guard';
import {PanelControl} from './panel-control/panel-control';
import {MedicalRecord} from './panel-control/medical-record/medical-record';
import {QuestionnareDentistry} from './panel-control/medical-record/questionnare-dentistry/questionnare-dentistry';
import {Evolution} from './panel-control/medical-record/evolution/evolution';
import {
  QuestionnareEndodontics
} from './panel-control/medical-record/questionnare-endodontics/questionnare-endodontics';
import {VitalSigns} from './panel-control/medical-record/vital-signs/vital-signs';
import {Consents} from './panel-control/medical-record/consents/consents';
import {QuestionnarePediatric} from './panel-control/medical-record/questionnare-pediatric/questionnare-pediatric';

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
        path: 'panel-control/patient/:id', // <--- CAMBIO AQUÍ: Agregamos /patient/ antes del parámetro :id
        component: PanelControl,
        children: [
          {
            path: 'historia-clinica',
            component: MedicalRecord,
            children: [
              { path: 'odontologia', component: QuestionnareDentistry },
              { path: 'evolucion', component: Evolution },
              { path: 'pediatria', component: QuestionnarePediatric },
              { path: 'endodoncia', component: QuestionnareEndodontics },
              { path: 'signos-vitales', component: VitalSigns },
              { path: 'consentimientos', component: Consents },
              { path: '', redirectTo: 'odontologia', pathMatch: 'full' }
            ]
          },
          { path: '', redirectTo: 'historia-clinica', pathMatch: 'full' }
        ]
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
