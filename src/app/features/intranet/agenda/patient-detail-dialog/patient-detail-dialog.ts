import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentService} from '../../../../core/services/appointment.service';
import { Appointment} from '../../../../shared/models/appointment.model';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {Patient, PatientTag, BloodGroup} from '../../../../shared/models/patient.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {PatientService} from '../../../../core/services/patient.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatMenuModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    MatProgressSpinner,
    FormsModule
  ],
  templateUrl: './patient-detail-dialog.html',
  styleUrl: './patient-detail-dialog.css',

})
export class PatientDetailDialog implements OnInit {
  patient?: Patient;
  availableTags: PatientTag[] = [];
  patientAppointments: Appointment[] = [];
  // En tu archivo .ts
  readonly bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  isLoading = false; // 2. Variable para el estado de carga

  statusLabels: any = {
    'PENDIENTE': 'Pendiente',
    'CONFIRMADA': 'Confirmada',
    'EN_CURSO': 'En curso',
    'COMPLETADA': 'Completada',
    'CANCELADA': 'Cancelada',
    'NO_ASISTIO': 'No asistió'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment },
    private dialogRef: MatDialogRef<PatientDetailDialog>,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPatient();
    this.loadAvailableTags();
  }

  loadPatient(): void {
    this.patient = this.data.appointment.patient;
    this.loadPatientAppointments(this.data.appointment.patientId);
  }

  loadPatientAppointments(patientId: number): void {
    // Aquí usamos la nueva función del service
    this.appointmentService.getAppointmentsByPatientId(patientId).subscribe(apps => {
      this.patientAppointments = apps;
    });
  }

  loadAvailableTags(): void {
    this.appointmentService.getPatientTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
      }
    });
  }

  saveChanges(): void {
    if (!this.patient || !this.patient.id) return;

    this.isLoading = true;

    // Enviamos solo el cambio del grupo sanguíneo o el objeto completo
    // El backend con @Patch aceptará campos parciales
    this.patientService.updatePatient(this.patient.id, {
      bloodGroup: this.patient.bloodGroup
    }).subscribe({
      next: (updatedPatient) => {
        this.isLoading = false;
        this.patient = updatedPatient;
        this.showNotification('Cambios guardados correctamente', 'success');
        this.dialogRef.close(updatedPatient);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al actualizar paciente:', err);
        alert('Error al guardar los cambios');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  removeTag(tagId: number): void {
    /*if (this.patient) {
      this.appointmentService.removeTagFromPatient(this.patient.id, tagId).subscribe({
        next: (updatedPatient) => {
          this.patient = updatedPatient;
        }
      });
    }*/
  }

  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] || status;
  }
}
