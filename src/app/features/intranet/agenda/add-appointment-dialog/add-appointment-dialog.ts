import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Agregado
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {
  APPOINTMENT_STATUS_OPTIONS, AppointmentStatus,
  DurationOption
} from '../../../../shared/models/appointment.model';
import {User} from '../../../../shared/models/user.model';
import { Patient } from '../../../../shared/models/patient.model';
import { AppointmentService } from '../../../../core/services/appointment.service';
import {provideDateFnsAdapter} from '@angular/material-date-fns-adapter';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {es} from 'date-fns/locale';
import { format } from 'date-fns'; // Asegúrate de tener date-fns instalado
import { CreateAppointmentDto} from '../../../../shared/models/appointment.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatTabsModule, MatProgressSpinner
  ],
  providers: [
    provideDateFnsAdapter(), // <--- SOLUCIÓN AL ERROR
    { provide: MAT_DATE_LOCALE, useValue: es }
  ],
  templateUrl: './add-appointment-dialog.html',
  styleUrl: './add-appointment-dialog.css',
})
export class AddAppointmentDialog implements OnInit {
  doctors: User[] = [];
  patients: Patient[] = [];
  statuses = APPOINTMENT_STATUS_OPTIONS;
  durationOptions: DurationOption[] = [];

  isSaving = false; // Estado para el botón de carga

  // Usamos el modelo en inglés desde el inicio
  appointment: CreateAppointmentDto = {
    branch: 'Principal',
    patientId: 0,
    doctorId: 0,
    specialty: '',
    reason: '',
    duration: 30,
    status: AppointmentStatus.PENDIENTE,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    notes: '',
    officeId: undefined
  };

  timeValues = { hour: 10, minute: 0, period: 'AM' };

  constructor(
    private dialogRef: MatDialogRef<AddAppointmentDialog>,
    private appointmentService: AppointmentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.generateDurationOptions();
  }

  ngOnInit() {
    this.appointmentService.getDoctors().subscribe(docs => this.doctors = docs);
    this.appointmentService.getPatients().subscribe(pats => this.patients = pats);

    if (this.data?.fecha) {
      // Si la fecha viene como Date, la pasamos a string yyyy-MM-dd
      this.appointment.date = format(this.data.fecha, 'yyyy-MM-dd');
    }
    this.formatTime();
  }

  generateDurationOptions() {
    for (let min = 30; min <= 480; min += 30) {
      const hours = Math.floor(min / 60);
      const minutes = min % 60;
      const label = `${hours}h ${minutes === 0 ? '00' : minutes}`;
      this.durationOptions.push({ label, value: min });
    }
  }

  // Validador para el botón
  isFormInvalid(): boolean {
    return !this.appointment.patientId ||
      !this.appointment.doctorId ||
      !this.appointment.specialty?.trim() ||
      !this.appointment.reason?.trim() ||
      !this.appointment.startTime;
  }

  validateTimeInput(type: 'hour' | 'minute') {
    let value = Number(this.timeValues[type]);
    if (type === 'hour') {
      if (value > 12) value = 12;
      if (value < 1) value = 1;
    } else {
      if (value > 59) value = 59;
      if (value < 0) value = 0;
    }
    this.timeValues[type] = value;
    this.formatTime();
  }

  formatTime() {
    // Convertimos el formato AM/PM a 24h para el startTime del DTO
    let hour = this.timeValues.hour;
    if (this.timeValues.period === 'PM' && hour < 12) hour += 12;
    if (this.timeValues.period === 'AM' && hour === 12) hour = 0;

    const hh = String(hour).padStart(2, '0');
    const mm = String(this.timeValues.minute || 0).padStart(2, '0');

    this.appointment.startTime = `${hh}:${mm}`;
  }

  onSave() {
    if (this.isFormInvalid()) return;

    this.isSaving = true;

    // Ya tenemos el objeto construido en 'this.appointment' siguiendo el CreateAppointmentDto
    this.appointmentService.createAppointment(this.appointment).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        alert("Error al crear la cita");
      }
    });
  }

  close() { this.dialogRef.close(); }
}
