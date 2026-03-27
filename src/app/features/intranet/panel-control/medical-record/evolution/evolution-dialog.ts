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
    h2 { color: #5ba3a2; font-weight: 600; }
  `]
})
export class EvolutionDialog implements OnInit { // <--- El EXPORT es vital
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EvolutionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', note?: any }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      content: [this.data.note?.content || '', [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
