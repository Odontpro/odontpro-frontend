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
import { MedicalHistoryService } from '../../../../../core/services/medical-history.service';
import { ActivatedRoute } from '@angular/router'; // 👈 Importante

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
  patientId!: number;
  loading = false;

  rows = [
    { key: 'peso', label: 'Peso(Kg)' },
    { key: 'talla', label: 'Talla(m)' },
    { key: 'temperatura', label: 'Temperatura(°C)' },
    { key: 'tension', label: 'Tensión arterial(mmHg)' },
    { key: 'frecuencia', label: 'F. cardiaca(lat/min)' },
    { key: 'oxigenacion', label: 'Oxigenación (SpO2)' }
  ];

  constructor(
    private fb: FormBuilder,
    private medicalService: MedicalHistoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.extractPatientId(); // 👈 Primero resolvemos el ID
    this.initForm();
  }

  private extractPatientId(): void {
    // Al igual que en Odontología y Evolución, subimos dos niveles
    // para encontrar el parámetro :id definido en PanelControl
    const idParam = this.route.parent?.parent?.snapshot.paramMap.get('id');

    if (idParam) {
      this.patientId = Number(idParam);
      this.loadVitalSigns(); // 👈 Solo cargamos si el ID es válido
    } else {
      console.error('No se pudo obtener el ID del paciente desde la URL');
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      columns: this.fb.array([]), // Iniciamos vacío para cargar desde el back
      notaAdicional: ['']
    });
  }

  get isLimitReached(): boolean {
    // Verificamos si 'this.columns' existe y su longitud
    return this.columns ? this.columns.length >= 6 : false;
  }

  get columns(): FormArray {
    return this.form.get('columns') as FormArray;
  }

  loadVitalSigns(): void {
    if (!this.patientId) return; // Guard clause

    this.loading = true;
    this.medicalService.getVitalSigns(this.patientId).subscribe({
      next: (data) => {
        // Limpiamos el array actual
        while (this.columns.length) { this.columns.removeAt(0); }

        if (data && data.length > 0) {
          data.forEach(item => {
            this.columns.push(this.createColumn(item));
          });
          this.form.patchValue({ notaAdicional: data[0].notaAdicional });
        }

        // Relleno estético
        while (this.columns.length < 3) {
          this.addColumn();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando signos vitales:', err);
        this.loading = false;
        if (this.columns.length === 0) this.addColumn();
      }
    });
  }

  // Modificado para aceptar un objeto de datos opcional
  createColumn(data: any = null): FormGroup {
    return this.fb.group({
      fecha: [data?.fecha ? new Date(data.fecha) : null],
      peso: [data?.peso || '', [Validators.pattern('^[0-9.]*$')]],
      talla: [data?.talla || '', [Validators.pattern('^[0-9.]*$')]],
      temperatura: [data?.temperatura || '', [Validators.pattern('^[0-9.]*$')]],
      tension: [data?.tension || '', [Validators.pattern('^[0-9/]*$')]],
      frecuencia: [data?.frecuencia || '', [Validators.pattern('^[0-9]*$')]],
      oxigenacion: [data?.oxigenacion || '', [Validators.pattern('^[0-9]*$')]]
    });
  }

  addColumn() {
    if (this.columns.length < 6) {
      this.columns.push(this.createColumn());
    }
  }

  save() {
    console.log('--- Intento de Guardado ---');

    if (this.form.invalid) {
      console.warn('Formulario inválido');
      return;
    }

    const rawValue = this.form.getRawValue(); // Usamos getRawValue por si hay campos disabled

    // Filtro mejorado: Solo enviamos columnas que tengan al menos FECHA o algún valor
    const filteredColumns = rawValue.columns.filter((col: any) => {
      return col.fecha !== null ||
        col.peso || col.talla || col.temperatura ||
        col.tension || col.frecuencia || col.oxigenacion;
    });

    const payload = {
      columns: filteredColumns,
      notaAdicional: rawValue.notaAdicional
    };

    console.log('Enviando al backend:', payload);

    if (payload.columns.length === 0 && !payload.notaAdicional) {
      alert('No hay datos para guardar');
      return;
    }

    this.medicalService.saveVitalSigns(this.patientId, payload).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('Signos vitales actualizados correctamente');
        this.loadVitalSigns();
      },
      error: (err) => console.error('Error HTTP:', err)
    });
  }

// Helper para ver qué está fallando si el formulario es invalid
  getFormValidationErrors() {
    const errors: { column: number; field: string; error: any; }[] = [];
    const columnsArray = this.form.get('columns') as FormArray;

    columnsArray.controls.forEach((group: any, index) => {
      Object.keys(group.controls).forEach(key => {
        const controlErrors = group.get(key).errors;
        if (controlErrors) errors.push({ column: index, field: key, error: controlErrors });
      });
    });
    return errors;
  }
}
