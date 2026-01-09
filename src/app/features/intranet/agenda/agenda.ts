import {Component, OnInit, ChangeDetectionStrategy, signal, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../shared/models/appointment.model';
import { User} from '../../../shared/models/user.model';
import { PatientDetailDialog} from './patient-detail-dialog/patient-detail-dialog';
import { AppointmentDetailDialog} from './appointment-detail-dialog/appointment-detail-dialog';
import {FormsModule} from '@angular/forms';
import {CalendarModule, CalendarWeekViewComponent, DateAdapter, provideCalendar} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarEvent, CalendarView, } from 'angular-calendar';
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { Subject } from 'rxjs';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para fechas en español
import { addMinutes, parseISO, parse } from 'date-fns';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import {MatDatepicker, MatDatepickerInput, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';

// Registramos los datos de localización para español
registerLocaleData(localeEs);

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatMenuModule,
    FormsModule,
    CalendarWeekViewComponent,
    CalendarModule,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatCheckboxModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: es },
    { provide: LOCALE_ID, useValue: 'es' }, // <--- Añade esto
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),

  ],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  // Configuración del Calendario
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh = new Subject<void>();

  // Datos
  events: CalendarEvent[] = [];
  doctors: User[] = [];
  selectedDoctors: number[] = [];
  allAppointments: Appointment[] = [];
  selectedStatus: string = 'TODOS';
  isSidebarVisible: boolean = true;

  statusOptions = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'CONFIRMADA', label: 'Confirmada' },
    { value: 'EN_CURSO', label: 'En curso' },
    { value: 'COMPLETADA', label: 'Completada' },
    { value: 'CANCELADA', label: 'Cancelada' },
    { value: 'NO_ASISTIO', label: 'No asistió' }
  ];

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAppointments();

    const sub = this.appointmentService.appointmentCreated$.subscribe(newAppointment => {
      // Agregamos al arreglo local
      this.allAppointments = [...this.allAppointments, newAppointment];

      // Actualizamos la visualización
      this.refreshCalendar();
    });

    this.subscription.add(sub);
  }

  ngOnDestroy() {
    // Muy importante para evitar fugas de memoria
    this.subscription.unsubscribe();
  }

  refreshCalendar() {
    this.filterAndMapEvents();

    this.refresh.next();
  }

  loadDoctors(): void {
    this.appointmentService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        // Por defecto, mostrar todos los doctores
        this.selectedDoctors = doctors.map(d => d.id);
      }
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        console.log(appointments);
        this.allAppointments = appointments;
        this.filterAndMapEvents();
      }
    });
  }

  changeView(view: CalendarView) {
    this.view = view;
  }

  filterAndMapEvents(): void {
    const filtered = this.allAppointments.filter(app => {
      const matchDoctor = this.selectedDoctors.length === 0 || this.selectedDoctors.includes(app.doctorId);
      const matchStatus = this.selectedStatus === 'TODOS' || app.status === this.selectedStatus;
      return matchDoctor && matchStatus;
    });

    this.events = filtered.map(app => {
      // Combinamos Fecha y Hora Inicial usando los nuevos nombres de atributos
      const dateStr = format(app.date, 'yyyy-MM-dd');
      const start = parse(`${dateStr} ${app.startTime}`, 'yyyy-MM-dd HH:mm', new Date());

      // Calculamos la hora final
      const end = addMinutes(start, app.duration);

      return {
        start: start,
        end: end,
        // LLAMADA AL SERVICIO: Obtenemos el nombre formateado desde el AppointmentService
        title: this.appointmentService.getPatientName(app.patientId),

        color: {
          primary: this.getDoctorColor(app.doctorId),
          secondary: '#E3F2FD'
        },
        meta: { appointment: app },
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: false
      };
    });

    this.refresh.next();
  }

  onDatePicked(newDate: Date | null): void {
    if (newDate) {
      this.viewDate = newDate;
      this.refresh.next();
    }
  }

  handleEventClick(event: CalendarEvent): void {
    this.openAppointmentDetail(event.meta.appointment);
  }

  openPatientDetail(appointment: Appointment): void {
    this.dialog.open(PatientDetailDialog, {
      data: { appointment },
      width: '1100px'
    });
  }

  openAppointmentDetail(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentDetailDialog, {
      data: { appointment: { ...appointment } }, // Enviamos una copia para no alterar el original antes de guardar
      width: '1100px',
      maxWidth: '95vw', // Para que en tablets no se desborde
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el resultado es true, refrescamos los datos del calendario
        this.loadAppointments();
      }
    });
  }

  incrementView(): void {
    if (this.view === CalendarView.Day) {
      this.viewDate = addDays(this.viewDate, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = addWeeks(this.viewDate, 1);
    } else if (this.view === CalendarView.Month) {
      this.viewDate = addMonths(this.viewDate, 1);
    }
    this.refresh.next(); // Forzar actualización del calendario
  }

  decrementView(): void {
    if (this.view === CalendarView.Day) {
      this.viewDate = subDays(this.viewDate, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = subWeeks(this.viewDate, 1);
    } else if (this.view === CalendarView.Month) {
      this.viewDate = subMonths(this.viewDate, 1);
    }
    this.refresh.next();
  }

  getRangeLabel(): string {
    if (this.view === CalendarView.Day) {
      return format(this.viewDate, "dd 'de' MMMM yyyy", { locale: es });
    } else if (this.view === CalendarView.Week) {
      const start = startOfWeek(this.viewDate, { weekStartsOn: 1 });
      const end = endOfWeek(this.viewDate, { weekStartsOn: 1 });
      return `${format(start, 'dd MMM')} - ${format(end, 'dd MMM yyyy', { locale: es })}`;
    } else {
      // Modo Mes: "Enero 2026"
      return format(this.viewDate, 'MMMM yyyy', { locale: es });
    }
  }

  goToToday() { this.viewDate = new Date(); }

  toggleDoctorFilter(doctorId: number): void {
    const index = this.selectedDoctors.indexOf(doctorId);

    if (index > -1) {
      // Si ya estaba, lo quitamos (desmarcar)
      this.selectedDoctors.splice(index, 1);
    } else {
      // Si no estaba, lo agregamos (marcar)
      this.selectedDoctors.push(doctorId);
    }

    // Crucial: Volvemos a filtrar los eventos y refrescamos la vista
    this.filterAndMapEvents();
  }

  onStatusFilterChange(): void {
    this.loadAppointments();
  }

  getDoctorColor(doctorId: number): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return '#9e9e9e';
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'PENDIENTE': '#ff9800',
      'CONFIRMADA': '#4caf50',
      'EN_CURSO': '#2196f3',
      'COMPLETADA': '#9e9e9e',
      'CANCELADA': '#f44336',
      'NO_ASISTIO': '#d32f2f'
    };
    return colors[status] || '#9e9e9e';
  }
}
