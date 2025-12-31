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
import {UserService} from '../../../../core/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UpdateUserDto} from '../../../../shared/dto/update-user.dto';

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
  templateUrl: './user-edit-dialog.html',
  styleUrl: './user-edit-dialog.css'
})
export class UserEditDialog implements OnInit {
  editForm: FormGroup;
  loading = false;

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'ASISTENTE', label: 'Asistente' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private dialogRef: MatDialogRef<UserEditDialog>,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      role: [data.role?.toUpperCase(), Validators.required]
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
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const updateData: UpdateUserDto = this.editForm.value;

    this.userService.updateUser(this.data.id, updateData).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.dialogRef.close(updatedUser);
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Error al actualizar usuario';
        this.snackBar.open(message, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
}
