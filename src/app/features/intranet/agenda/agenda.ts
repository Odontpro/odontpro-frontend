import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentService } from '../../../core/services/appointment.service';
import {
  Appointment,
  Doctor,
  AppointmentFilters
} from '../../../shared/models/appointment.model';
import { PatientDetailDialog} from './patient-detail-dialog/patient-detail-dialog';
import {FormsModule} from '@angular/forms';

interface CalendarDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  appointments: Appointment[];
}

interface TimeSlot {
  time: string;
  hour: number;
}
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
    FormsModule
  ],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit {
  currentWeekStart: Date = new Date();
  calendarDays: CalendarDay[] = [];
  timeSlots: TimeSlot[] = [];

  doctors: Doctor[] = [];
  selectedDoctors: number[] = []; // IDs de doctores seleccionados para filtrar

  allAppointments: Appointment[] = [];

  // Estados de filtro
  selectedStatus: string = 'TODOS';
  viewMode: 'week' | 'day' = 'week';

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
    this.initializeTimeSlots();
    this.setCurrentWeek();
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAppointments();
  }

  initializeTimeSlots(): void {
    // Generar slots de 9 AM a 6 PM
    for (let hour = 9; hour <= 18; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      this.timeSlots.push({ time: timeString, hour });
    }
  }

  setCurrentWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    // Ajustar para que la semana empiece en lunes
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() + diff);
    this.currentWeekStart.setHours(0, 0, 0, 0);

    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 6; i++) { // Lunes a Sábado
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);

      this.calendarDays.push({
        date: date,
        dayName: dayNames[i],
        dayNumber: date.getDate(),
        isToday: date.getTime() === today.getTime(),
        appointments: []
      });
    }
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
    const filters: AppointmentFilters = {
      fechaInicio: this.formatDate(this.calendarDays[0].date),
      fechaFin: this.formatDate(this.calendarDays[this.calendarDays.length - 1].date)
    };

    if (this.selectedStatus !== 'TODOS') {
      filters.estado = this.selectedStatus as any;
    }

    this.appointmentService.getAppointments(filters).subscribe({
      next: (appointments) => {
        this.allAppointments = appointments;
        this.distributeAppointments();
      }
    });
  }

  distributeAppointments(): void {
    // Limpiar appointments actuales
    this.calendarDays.forEach(day => day.appointments = []);

    // Filtrar por doctores seleccionados
    const filteredAppointments = this.allAppointments.filter(app =>
      this.selectedDoctors.includes(app.doctorId)
    );

    // Distribuir citas en los días correspondientes
    filteredAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.fecha);
      appointmentDate.setHours(0, 0, 0, 0);

      const day = this.calendarDays.find(d =>
        d.date.getTime() === appointmentDate.getTime()
      );

      if (day) {
        day.appointments.push(appointment);
      }
    });
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateCalendarDays();
    this.loadAppointments();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateCalendarDays();
    this.loadAppointments();
  }

  goToToday(): void {
    this.setCurrentWeek();
    this.loadAppointments();
  }

  toggleDoctorFilter(doctorId: number): void {
    const index = this.selectedDoctors.indexOf(doctorId);
    if (index > -1) {
      this.selectedDoctors.splice(index, 1);
    } else {
      this.selectedDoctors.push(doctorId);
    }
    this.distributeAppointments();
  }

  onStatusFilterChange(): void {
    this.loadAppointments();
  }

  getAppointmentsForTimeSlot(day: CalendarDay, timeSlot: TimeSlot): Appointment[] {
    return day.appointments.filter(app => {
      const [hour, minute] = app.horaInicial.split(':').map(Number);
      return hour === timeSlot.hour;
    });
  }

  getAppointmentStyle(appointment: Appointment): any {
    const doctor = this.doctors.find(d => d.id === appointment.doctorId);
    const duration = appointment.duracion;

    // Calcular altura basada en duración (60 minutos = 60px aproximadamente)
    const height = (duration / 60) * 60;

    return {
      'background-color': doctor?.color || '#9e9e9e',
      'height.px': height,
      'min-height.px': 40
    };
  }

  getAppointmentPosition(appointment: Appointment): any {
    const [hour, minute] = appointment.horaInicial.split(':').map(Number);

    // Calcular posición top basada en los minutos
    const topOffset = (minute / 60) * 60;

    return {
      'top.px': topOffset
    };
  }

  openAppointmentDetail(appointment: Appointment): void {
    this.dialog.open(PatientDetailDialog, {
      data: {
        patientId: appointment.patientId,
        appointment: appointment
      },
      width: '600px',
      autoFocus: false
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWeekRange(): string {
    const start = this.calendarDays[0];
    const end = this.calendarDays[this.calendarDays.length - 1];

    const startMonth = start.date.toLocaleDateString('es-ES', { month: 'short' });
    const endMonth = end.date.toLocaleDateString('es-ES', { month: 'short' });
    const year = start.date.getFullYear();

    return `${start.dayNumber} ${startMonth} - ${end.dayNumber} ${endMonth} ${year}`;
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
