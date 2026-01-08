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
  Appointment,
  APPOINTMENT_STATUS_OPTIONS,
  AppointmentStatus,
  Doctor,
  DurationOption,
  Patient
} from '../../../../shared/models/appointment.model';
import { AppointmentService } from '../../../../core/services/appointment.service';
import {provideDateFnsAdapter} from '@angular/material-date-fns-adapter';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {es} from 'date-fns/locale';

@Component({
  selector: 'app-add-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatTabsModule
  ],
  providers: [
    provideDateFnsAdapter(), // <--- SOLUCIÓN AL ERROR
    { provide: MAT_DATE_LOCALE, useValue: es }
  ],
  templateUrl: './add-appointment-dialog.html',
  styleUrl: './add-appointment-dialog.css',
})
export class AddAppointmentDialog implements OnInit {
  doctors: Doctor[] = [];
  patients: Patient[] = []; // Nueva lista
  statuses = APPOINTMENT_STATUS_OPTIONS;
  durationOptions: DurationOption[] = [];

  // Objeto inicializado para el formulario
  appointment: any = {
    sucursal: 'Principal',
    patientId: null,
    doctorId: null,
    especialidad: '',
    motivo: '',
    duracion: 30,
    estado: 'PENDIENTE',
    fecha: new Date(),
    horaInicial: '',
    notas: ''
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
    // Asumiendo que tienes un método para pacientes
    this.appointmentService.getPatients().subscribe(pats => this.patients = pats);

    // Si recibimos fecha desde el calendario (clic en un día)
    if (this.data?.fecha) {
      this.appointment.fecha = this.data.fecha;
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
    const hh = String(this.timeValues.hour || 12).padStart(2, '0');
    const mm = String(this.timeValues.minute || 0).padStart(2, '0');
    this.appointment.horaInicial = `${hh}:${mm} ${this.timeValues.period}`;
  }

  onSave() {
    if (!this.appointment.patientId || !this.appointment.doctorId) {
      alert("Por favor seleccione paciente y doctor");
      return;
    }
    this.dialogRef.close(this.appointment);
  }

  close() { this.dialogRef.close(); }
}
