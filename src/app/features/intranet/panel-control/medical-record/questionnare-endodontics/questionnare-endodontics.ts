import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-questionnare-endodontics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './questionnare-endodontics.html',
  styleUrl: './questionnare-endodontics.css',
})
export class QuestionnareEndodontics implements OnInit {
  form!: FormGroup;

  // Lista de doctores para el select
  doctors = [
    { id: 1, name: 'Diego Talledo Sanchez' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      doctorId: [1], // Por defecto Diego Talledo Sanchez
      // Las secciones se irán rellenando una a una
      seccion: this.fb.group({}),
      examenClinico: this.fb.group({}),
      pruebaVitalidad: this.fb.group({}),
      examenRadiografico: this.fb.group({}),
      diagPulpar: this.fb.group({}),
      diagPeriapical: this.fb.group({}),
      diagDefinitivo: this.fb.group({}),
      tratamientoIndicado: this.fb.group({}),
      datosClinicos: this.fb.group({})
    });
  }

  // Helpers para validación
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  save() {
    console.log('Datos de Endodoncia:', this.form.value);
  }
}
