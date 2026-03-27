import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EvolutionDialog} from './evolution-dialog';
import {EvolutionNote} from '../../../../../shared/models/evolution.model'; // Componente que crearemos

@Component({
  selector: 'app-evolution',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule],
  templateUrl: './evolution.html',
  styleUrl: './evolution.css',
})
export class Evolution implements OnInit {
  // Lista de ejemplo basada en tu imagen
  evolutions: EvolutionNote[] = [
    {
      id: 1,
      date: new Date('2026-01-23T17:48:00'),
      doctorName: 'Diego Talledo Sanchez',
      content: 'asdsadsad'
    },
    {
      id: 2,
      date: new Date('2026-01-23T17:48:00'),
      doctorName: 'Diego Talledo Sanchez',
      content: 'a'
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openAddDialog() {
    const dialogRef = this.dialog.open(EvolutionDialog, {
      width: '550px',
      disableClose: true,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newNote = {
          id: Date.now(), // ID temporal
          date: new Date(),
          doctorName: 'Diego Talledo Sanchez', //
          content: result.content
        };
        this.evolutions = [newNote, ...this.evolutions];
        // Aquí llamarías a tu patientService.saveEvolution(newNote)
      }
    });
  }

  editItem(item: EvolutionNote) {
    this.dialog.open(EvolutionDialog, {
      width: '500px',
      data: { mode: 'edit', note: item }
    });
  }

  deleteItem(id: number) {
    // Lógica para eliminar
    this.evolutions = this.evolutions.filter(e => e.id !== id);
  }
}
