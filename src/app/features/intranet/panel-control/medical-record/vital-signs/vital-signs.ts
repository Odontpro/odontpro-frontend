import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-vital-signs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip
  ],
  templateUrl: './vital-signs.html',
  styleUrl: './vital-signs.css',
})
export class VitalSigns implements OnInit {
  form!: FormGroup;
  // Definición de las filas que siempre estarán presentes
  rows = [
    { key: 'peso', label: 'Peso(Kg)' },
    { key: 'talla', label: 'Talla(m)' },
    { key: 'temperatura', label: 'Temperatura(°C)' },
    { key: 'tension', label: 'Tensión arterial(mmHg)' },
    { key: 'frecuencia', label: 'F. cardiaca(lat/min)' },
    { key: 'oxigenacion', label: 'Oxigenación (SpO2)' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // Array de columnas (cada una es una fecha con sus valores)
      columns: this.fb.array([
        this.createColumn(new Date('2026-01-23')),
        this.createColumn(new Date('2026-01-22')),
        this.createColumn() // Columna vacía para nueva entrada
      ]),
      notaAdicional: ['']
    });
  }

  get columns(): FormArray {
    return this.form.get('columns') as FormArray;
  }

  createColumn(date: Date | null = null): FormGroup {
    return this.fb.group({
      fecha: [date],
      peso: ['', [Validators.pattern('^[0-9.]*$')]],
      talla: ['', [Validators.pattern('^[0-9.]*$')]],
      temperatura: ['', [Validators.pattern('^[0-9.]*$')]],
      tension: ['', [Validators.pattern('^[0-9/]*$')]],
      frecuencia: ['', [Validators.pattern('^[0-9]*$')]],
      oxigenacion: ['', [Validators.pattern('^[0-9]*$')]]
    });
  }

  // ... dentro de la clase VitalSigns

  addColumn() {
    // Verificamos si ya llegamos al límite de 6
    if (this.columns.length < 6) {
      this.columns.push(this.createColumn());
    } else {
      // Opcional: Podrías mostrar un SnackBar o alerta aquí
      console.warn('Límite de 6 columnas alcanzado');
    }
  }

  // Getter para usar en el HTML y deshabilitar el botón
  get isLimitReached(): boolean {
    return this.columns.length >= 6;
  }

  save() {
    if (this.form.valid) {
      console.log('Datos de Signos Vitales:', this.form.value);
    }
  }
}
