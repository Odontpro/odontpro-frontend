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
import { Appointment, AppointmentStatus, Doctor } from '../../../../shared/models/appointment.model';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { es } from 'date-fns/locale';
import { PatientDetailDialog} from '../patient-detail-dialog/patient-detail-dialog';
import { DurationOption} from '../../../../shared/models/appointment.model';

@Component({
  selector: 'app-appointment-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatButtonModule, MatIconModule
  ],
  providers: [
    provideDateFnsAdapter(), // <--- SOLUCIÓN AL ERROR
    { provide: MAT_DATE_LOCALE, useValue: es }
  ],
  templateUrl: './appointment-detail-dialog.html',
  styleUrl: './appointment-detail-dialog.css',
})
export class AppointmentDetailDialog implements OnInit {
  doctors: Doctor[] = [];
  statuses: AppointmentStatus[] = ['PENDIENTE', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO'];
  durationOptions: DurationOption[] = [];

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

  openPatientDetail(appointment: Appointment): void {
    this.dialog.open(PatientDetailDialog, {
      data: { appointment },
      width: '1100px'
    });
  }

  viewPatient(): void {
    // 1. Guardamos la referencia de la cita actual
    const currentAppointment = this.data.appointment;

    // 2. Cerramos el diálogo actual (Detalle de Cita)
    this.dialogRef.close();

    // 3. Abrimos el detalle del paciente
    const patientRef = this.dialog.open(PatientDetailDialog, {
      data: { appointment: currentAppointment },
      width: '1100px'
    });
  }

  onSave() {
    // Aquí llamarías a tu servicio para persistir los datos
    // Simulamos una actualización con el ID del usuario actual (ej. 1)
    this.appointmentService.updateAppointment(
      this.data.appointment.id,
      this.data.appointment,
      1,
      'Usuario Actual'
    ).subscribe({
      next: (updatedApp) => {
        console.log('Cita actualizada:', updatedApp);
        this.dialogRef.close(true); // Cerramos enviando 'true' para indicar que hubo cambios
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  onDelete() {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      this.appointmentService.deleteAppointment(this.data.appointment.id).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
