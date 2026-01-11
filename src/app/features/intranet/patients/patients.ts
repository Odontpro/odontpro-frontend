import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from "@angular/material/sort";

import { Patient } from '../../../shared/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSortModule,
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  // Columnas actualizadas según tu requerimiento
  displayedColumns: string[] = ['fullName', 'documentNumber', 'phoneNumber', 'email', 'actions'];
  searchTerm = '';

  constructor(
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.filteredPatients = patients;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar pacientes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = searchValue;

    this.filteredPatients = this.patients.filter(patient =>
      // Usamos (val || '') para convertir undefined/null en un string vacío antes de comparar
      (patient.email || '').toLowerCase().includes(searchValue) ||
      (patient.firstName || '').toLowerCase().includes(searchValue) ||
      (patient.lastNamePaternal || '').toLowerCase().includes(searchValue) ||
      (patient.documentNumber || '').includes(searchValue) ||
      (patient.phoneNumber || '').includes(searchValue)
    );
  }

  sortData(sort: Sort): void {
    const data = this.filteredPatients.slice();

    if (!sort.active || sort.direction === '') {
      this.filteredPatients = data;
      return;
    }

    this.filteredPatients = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'email': return this.compare(a.email || '', b.email || '', isAsc);
        case 'fullName': return this.compare(`${a.firstName} ${a.lastNamePaternal}`, `${b.firstName} ${b.lastNamePaternal}`, isAsc);
        case 'documentNumber': return this.compare(a.documentNumber || '', b.documentNumber || '', isAsc);
        case 'phoneNumber': return this.compare(a.phoneNumber || '', b.phoneNumber || '', isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  viewHistory(patient: Patient): void {
    this.router.navigate(['/intranet/paciente', patient.id]);
  }
}
