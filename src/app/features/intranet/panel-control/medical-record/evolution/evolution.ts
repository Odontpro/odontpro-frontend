import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EvolutionDialog} from './evolution-dialog';
import {EvolutionNote} from '../../../../../shared/models/evolution.model';
import {MedicalHistoryService} from '../../../../../core/services/medical-history.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../../../../core/services/user.service'; // Componente que crearemos

@Component({
  selector: 'app-evolution',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule],
  templateUrl: './evolution.html',
  styleUrl: './evolution.css',
})
export class Evolution implements OnInit {
  evolutions: any[] = [];
  patientId!: number;
  doctors: any[] = [];

  constructor(
    private dialog: MatDialog,
    private medicalService: MedicalHistoryService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.extractPatientId();
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.userService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => console.error('Error cargando doctores:', err)
    });
  }

  private extractPatientId(): void {
    // Buscamos el ID en la ruta padre (panel-control/patient/:id)
    const idParam = this.route.parent?.parent?.snapshot.paramMap.get('id');

    if (idParam) {
      this.patientId = Number(idParam);
      this.loadEvolutions(); // Cargamos solo si el ID existe
    } else {
      console.error('No se encontró el ID del paciente en la URL');
    }
  }

  loadEvolutions() {
    this.medicalService.getEvolutions(this.patientId).subscribe({
      next: (data) => {
        // Mapeamos para asegurar que 'date' sea un objeto Date para los pipes del HTML
        this.evolutions = data.map(e => ({
          ...e,
          date: new Date(e.createdAt)
        }));
      },
      error: (err) => console.error('Error al cargar evoluciones', err)
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EvolutionDialog, {
      width: '550px',
      disableClose: true,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' ahora debería traer content y doctorId/doctorName del diálogo
      if (result && result.content && this.patientId) {

        // Buscamos el doctor seleccionado en nuestra lista para obtener el nombre
        const selectedDoctor = this.doctors.find(d => d.id === result.doctorId);

        const payload = {
          content: result.content,
          doctorId: result.doctorId,
          doctorName: selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : 'Doctor'
        };

        this.medicalService.createEvolution(this.patientId, payload).subscribe({
          next: () => this.loadEvolutions(),
          error: (err) => alert('Error al guardar la nota')
        });
      }
    });
  }

  editItem(item: any) {
    const dialogRef = this.dialog.open(EvolutionDialog, {
      width: '500px',
      data: { mode: 'edit', note: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.content) {
        this.medicalService.updateEvolution(item.id, result.content).subscribe({
          next: () => this.loadEvolutions(),
          error: (err) => alert('Error al actualizar')
        });
      }
    });
  }

  deleteItem(id: number) {
    if (confirm('¿Estás seguro de eliminar esta nota de evolución?')) {
      this.medicalService.deleteEvolution(id).subscribe({
        next: () => {
          this.evolutions = this.evolutions.filter(e => e.id !== id);
        },
        error: (err) => alert('No se pudo eliminar la nota')
      });
    }
  }
}
