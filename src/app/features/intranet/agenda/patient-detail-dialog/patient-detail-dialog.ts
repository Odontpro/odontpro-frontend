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
import {Patient, PatientTag} from '../../../../shared/models/patient.model';

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
    MatInput
  ],
  templateUrl: './patient-detail-dialog.html',
  styleUrl: './patient-detail-dialog.css',

})
export class PatientDetailDialog implements OnInit {
  patient?: Patient;
  availableTags: PatientTag[] = [];
  patientAppointments: Appointment[] = [];
  // En tu archivo .ts
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadPatient();
    this.loadAvailableTags();
  }

  loadPatient(): void {
    this.appointmentService.getPatientById(this.data.appointment.patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
        if(this.patient?.id){
          this.loadPatientAppointments(this.patient.id);
        }
      }
    });
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
