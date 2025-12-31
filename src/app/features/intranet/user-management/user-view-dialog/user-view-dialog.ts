import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User} from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-view-dialog.html',
  styleUrl: './user-view-dialog.css'
})
export class UserViewDialog {
  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'ASISTENTE', label: 'Asistente' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private dialogRef: MatDialogRef<UserViewDialog>
  ) {}

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find(r => r.value === role.toUpperCase());
    return roleObj ? roleObj.label : role;
  }
}
