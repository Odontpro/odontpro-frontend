import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-evolution-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'edit' ? 'Editar' : 'Agregar' }} evolución</h2>

    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Descripción de la evolución</mat-label>
        <textarea matInput
                  formControlName="content"
                  rows="6"
                  placeholder="Escriba los avances del tratamiento..."></textarea>
        <mat-error *ngIf="form.get('content')?.hasError('required')">
          La descripción es obligatoria
        </mat-error>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button
              color="primary"
              [disabled]="form.invalid"
              (click)="onSave()">
        {{ data.mode === 'edit' ? 'Actualizar' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-top: 10px; }
    textarea { resize: none; }
    /* Mantenemos el estilo visual de tu marca */
    h2 { color: #5ba3a2; font-weight: 600; }
    mat-dialog-content { min-width: 400px; }
  `]
})
export class EvolutionDialog implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EvolutionDialog>,
    // Definimos mejor el tipo de DATA para evitar errores de compilación
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', note?: any }
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      // Si es modo edit, cargamos el contenido existente
      content: [this.data.note?.content || '', [Validators.required, Validators.minLength(1)]]
    });
  }

  onCancel(): void {
    // Al cerrar sin nada, el .subscribe del padre recibirá 'undefined'
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      // Enviamos el objeto del formulario de vuelta al componente Evolution
      // El componente padre decidirá si llama a createEvolution o updateEvolution
      this.dialogRef.close(this.form.value);
    }
  }
}
