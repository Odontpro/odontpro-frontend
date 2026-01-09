import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  Appointment,
  AppointmentStatus,
  Doctor,
  APPOINTMENT_STATUS_OPTIONS,
  UpdateAppointmentDto
} from '../../../../shared/models/appointment.model';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { es } from 'date-fns/locale';
import { PatientDetailDialog} from '../patient-detail-dialog/patient-detail-dialog';
import { DurationOption} from '../../../../shared/models/appointment.model';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {MatTooltip} from '@angular/material/tooltip';
import {User} from '../../../../shared/models/user.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-appointment-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatButtonModule, MatIconModule, NgxMaterialTimepickerModule, MatTooltip, MatProgressSpinner
  ],
  providers: [
    provideDateFnsAdapter(), // <--- SOLUCIÓN AL ERROR
    { provide: MAT_DATE_LOCALE, useValue: es }
  ],
  templateUrl: './appointment-detail-dialog.html',
  styleUrl: './appointment-detail-dialog.css',
})
export class AppointmentDetailDialog implements OnInit {
  doctors: User[] = [];
  statuses: { value: AppointmentStatus; label: string }[] = APPOINTMENT_STATUS_OPTIONS;
  durationOptions: DurationOption[] = [];
  isSaving = false; // Flag para el estado de carga
  // En tu clase
  timeValues = {
    hour: 1,
    minute: 0,
    period: 'PM'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment },
    private dialogRef: MatDialogRef<AppointmentDetailDialog>,
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {
    this.generateDurationOptions();
    console.log(this.data.appointment);
  }

  ngOnInit() {
    this.appointmentService.getDoctors().subscribe(docs => this.doctors = docs);
    const appointment = this.data.appointment;
    if (appointment && appointment.startTime) {
      this.setTimeFromAppointment(appointment.startTime);
    }

  }

  isFormInvalid(): boolean {
    const app = this.data.appointment;
    return (
      !app.doctorId ||
      !app.specialty?.trim() ||
      !app.reason?.trim() ||
      !app.startTime ||
      !app.date ||
      !app.status
    );
  }

  generateDurationOptions() {
    const maxMinutes = 8 * 60; // 480 minutos (8 horas)
    const step = 30; // Intervalos de 30 min

    for (let min = 30; min <= maxMinutes; min += step) {
      const hours = Math.floor(min / 60);
      const minutes = min % 60;

      // Formato: 1h 30 o 0h 30 o 1h 00
      const label = `${hours}h ${minutes === 0 ? '00' : minutes}`;

      this.durationOptions.push({ label, value: min });
    }
  }

  setTimeFromAppointment(horaStr: string) {
    if (!horaStr) return;

    // Limpiamos espacios extra por si acaso
    horaStr = horaStr.trim();

    let hour: number;
    let minute: number;
    let period: 'AM' | 'PM';

    // 1. Detectar si trae AM o PM
    if (horaStr.toUpperCase().includes('AM') || horaStr.toUpperCase().includes('PM')) {
      const parts = horaStr.split(' '); // "10:00 PM" -> ["10:00", "PM"]
      const timeParts = parts[0].split(':');

      hour = parseInt(timeParts[0], 10);
      minute = parseInt(timeParts[1], 10);
      period = parts[1].toUpperCase() as 'AM' | 'PM';
    }
    // 2. Si no trae AM/PM, procesar como formato 24h (militar)
    else {
      const timeParts = horaStr.split(':'); // "19:00" -> ["19", "00"]
      let rawHour = parseInt(timeParts[0], 10);
      minute = parseInt(timeParts[1], 10);

      if (rawHour >= 12) {
        period = 'PM';
        // Convertir 13-23 a 1-11. Si es 12, se queda como 12 PM.
        hour = rawHour > 12 ? rawHour - 12 : 12;
      } else {
        period = 'AM';
        // Convertir 0 a 12 AM. Si es 1-11, se queda igual.
        hour = rawHour === 0 ? 12 : rawHour;
      }
    }

    // 3. Asignar a la vista
    this.timeValues = { hour, minute, period };

    // 4. Sincronizar el string final por si acaso
    this.formatTime();
  }

  validateTimeInput(type: 'hour' | 'minute') {
    let value = this.timeValues[type];

    // 1. Manejo de nulos o vacíos
    // @ts-ignore
    if (value === null || value === undefined || value === '') {
      return;
    }

    // 2. Convertir a número si es string
    value = Number(value);

    // 3. Bloqueo de números negativos
    if (value < 0) {
      value = 0;
    }

    // 4. Convertir a string para validar longitud de dígitos
    let sValue = value.toString();

    // 5. Si intentan poner 3 o más dígitos, nos quedamos solo con los 2 primeros
    if (sValue.length > 2) {
      sValue = sValue.slice(0, 2);
      value = parseInt(sValue, 10);
    }

    // 6. Validar rangos máximos EN TIEMPO REAL
    if (type === 'hour') {
      if (value > 12) {
        value = 12;
      }
      if (value < 1) {
        value = 1;
      }
    } else { // minute
      if (value > 59) {
        value = 59;
      }
      if (value < 0) {
        value = 0;
      }
    }

    // 7. Asignar el valor corregido inmediatamente
    this.timeValues[type] = value;

    // 8. Actualizar el modelo final
    this.formatTime();
  }

  ensureValidTime(type: 'hour' | 'minute') {
    let value = this.timeValues[type];

    // Si está vacío o es null, asignar valor por defecto
    // @ts-ignore
    if (value === null || value === undefined || value === '') {
      if (type === 'hour') {
        this.timeValues[type] = 12;
      } else {
        this.timeValues[type] = 0;
      }
    } else {
      // Asegurar que esté en el rango correcto
      value = Number(value);

      if (type === 'hour') {
        if (value < 1) this.timeValues[type] = 1;
        if (value > 12) this.timeValues[type] = 12;
      } else {
        if (value < 0) this.timeValues[type] = 0;
        if (value > 59) this.timeValues[type] = 59;
      }
    }

    this.formatTime();
  }

  formatTime() {
    const hh = String(this.timeValues.hour || 12).padStart(2, '0');
    const mm = String(this.timeValues.minute || 0).padStart(2, '0');
    this.data.appointment.startTime = `${hh}:${mm} ${this.timeValues.period}`;
  }

  viewPatient(): void {
    const currentAppointment = this.data.appointment;

    this.dialogRef.close();

    const patientRef = this.dialog.open(PatientDetailDialog, {
      data: { appointment: currentAppointment },
      width: '1100px'
    });
  }

  onSave() {
    if (this.isFormInvalid()) return;

    this.isSaving = true;
    const app = this.data.appointment;

    const date = new Date(app.date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const dateString = `${year}-${month}-${day}`; // Resultado: "2026-01-08" fijo

    // 2. Corregir la Hora (Convertir "02:00 PM" -> "14:00")
    const startTime24h = this.convertTo24h(app.startTime);

    const updateDto: UpdateAppointmentDto = {
      branch: app.branch,
      officeId: app.officeId ?? undefined,
      patientId: app.patientId,
      doctorId: app.doctorId,
      specialty: app.specialty,
      reason: app.reason,
      duration: app.duration,
      status: app.status,
      date: dateString,
      startTime: startTime24h, // <--- Enviamos formato 24h
      notes: app.notes
    };

    this.appointmentService.updateAppointment(app.id, updateDto).subscribe({
      next: (updatedApp) => {
        this.isSaving = false;
        this.dialogRef.close(updatedApp);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error:', err);
      }
    });
  }

  private convertTo24h(timeStr: string): string {
    if (!timeStr.includes('AM') && !timeStr.includes('PM')) return timeStr;

    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');
    } else {
      hours = hours.padStart(2, '0');
    }

    return `${hours}:${minutes}`;
  }

  onDelete() {
    if (confirm('¿Estás seguro?')) {
      this.appointmentService.deleteAppointment(this.data.appointment.id).subscribe({
        next: () => {
          this.dialogRef.close({ deletedId: this.data.appointment.id });
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
