import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment },
    private dialogRef: MatDialogRef<AppointmentDetailDialog>,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.appointmentService.getDoctors().subscribe(docs => this.doctors = docs);
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
