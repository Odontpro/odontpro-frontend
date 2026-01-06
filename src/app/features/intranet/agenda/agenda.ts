import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, Doctor } from '../../../shared/models/appointment.model';
import { PatientDetailDialog} from './patient-detail-dialog/patient-detail-dialog';
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
export class Agenda implements OnInit {

  // Configuración del Calendario
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh = new Subject<void>();

  // Datos
  events: CalendarEvent[] = [];
  doctors: Doctor[] = [];
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
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAppointments();
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
      const matchStatus = this.selectedStatus === 'TODOS' || app.estado === this.selectedStatus;
      return matchDoctor && matchStatus;
    });

    this.events = filtered.map(app => {
      // 1. Combinamos Fecha y Hora Inicial
      // Asumimos que app.fecha es "2026-01-05" y app.horaInicial es "09:00"
      const start = parse(`${app.fecha} ${app.horaInicial}`, 'yyyy-MM-dd HH:mm', new Date());

      // 2. Calculamos la hora final sumando la duración en minutos
      const end = addMinutes(start, app.duracion);

      return {
        start: start,
        end: end,
        title: app.patientName,
        // Usamos el color del doctor para el evento
        color: {
          primary: this.getDoctorColor(app.doctorId),
          secondary: '#E3F2FD'
        },
        // Pasamos TODO el objeto para tener acceso al historial y notas en el Dialog
        meta: { appointment: app },
        // Configuraciones de UX adicionales
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
    this.openPatientDetail(event.meta.appointment);
  }

  openPatientDetail(appointment: Appointment): void {
    this.dialog.open(PatientDetailDialog, {
      data: { appointment },
      width: '500px'
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
    return doctor?.color || '#9e9e9e';
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
