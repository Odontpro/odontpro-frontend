import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { User} from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">edit</mat-icon>
          <h2 mat-dialog-title>Editar Usuario</h2>
        </div>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="editForm" class="edit-form">
          <div class="form-group">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Nombre</mat-label>
              <mat-icon matPrefix class="field-icon">person</mat-icon>
              <input matInput formControlName="firstName" placeholder="Nombre">
              <mat-error *ngIf="editForm.get('firstName')?.invalid">
                {{ getErrorMessage('firstName') }}
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Apellido</mat-label>
              <mat-icon matPrefix class="field-icon">person_outline</mat-icon>
              <input matInput formControlName="lastName" placeholder="Apellido">
              <mat-error *ngIf="editForm.get('lastName')?.invalid">
                {{ getErrorMessage('lastName') }}
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Rol</mat-label>
              <mat-icon matPrefix class="field-icon">badge</mat-icon>
              <mat-select formControlName="role">
                <mat-option *ngFor="let role of roles" [value]="role.value">
                  {{ role.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="info-section">
            <mat-icon class="info-icon">info</mat-icon>
            <span class="info-text">El email no puede ser modificado: <strong>{{ data.email }}</strong></span>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button mat-dialog-close class="cancel-button">
          Cancelar
        </button>
        <button
          mat-flat-button
          class="save-button"
          [disabled]="editForm.invalid"
          (click)="onSave()"
        >
          <mat-icon>save</mat-icon>
          Guardar Cambios
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 500px;
      max-width: 90vw;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-icon {
      color: #1976d2;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #212121;
    }

    .close-button {
      color: #757575;
    }

    .dialog-content {
      padding: 24px !important;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      width: 100%;
    }

    .form-field {
      width: 100%;
    }

    .field-icon {
      color: #757575;
      margin-right: 8px;
    }

    .info-section {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: #e3f2fd;
      border-radius: 8px;
      border-left: 4px solid #1976d2;
      margin-top: 8px;
    }

    .info-icon {
      color: #1976d2;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .info-text {
      font-size: 13px;
      color: #1565c0;
      line-height: 1.5;
    }

    .dialog-actions {
      padding: 16px 24px !important;
      border-top: 1px solid #e0e0e0;
      justify-content: flex-end;
      gap: 12px;
    }

    .cancel-button {
      color: #757575;
      border-color: #e0e0e0;
      padding: 8px 24px;
      font-weight: 500;
    }

    .cancel-button:hover {
      background-color: #f5f5f5;
    }

    .save-button {
      background-color: #1976d2;
      color: white;
      padding: 8px 24px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .save-button:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .save-button:disabled {
      background-color: #e0e0e0;
      color: #9e9e9e;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      height: 0;
    }
  `]
})
export class UserEditDialog implements OnInit {
  editForm: FormGroup;

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'ASISTENTE', label: 'Asistente' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private dialogRef: MatDialogRef<UserEditDialog>,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      role: [data.role, Validators.required]
    });
  }

  ngOnInit(): void {}

  getErrorMessage(field: string): string {
    const control = this.editForm.get(field);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    return '';
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedUser: User = {
        ...this.data,
        ...this.editForm.value
      };
      this.dialogRef.close(updatedUser);
    }
  }
}
