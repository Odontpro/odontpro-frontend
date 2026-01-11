import {Component, OnInit} from '@angular/core';
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {MatError, MatFormField, MatInput, MatInputModule, MatLabel} from "@angular/material/input";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatOption} from "@angular/material/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {MatSort, MatSortHeader, MatSortModule, Sort} from "@angular/material/sort";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from '../../../shared/models/user.model';
import {UserService} from '../../../core/services/user.service';
import {PatientService} from '../../../core/services/patient.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSortModule,
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['email', 'fullName', 'actions'];
  searchTerm = '';

  constructor(
    private userService: UserService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = searchValue;

    this.filteredUsers = this.users.filter(user =>
      user.email.toLowerCase().includes(searchValue) ||
      user.firstName.toLowerCase().includes(searchValue) ||
      user.lastName.toLowerCase().includes(searchValue)
    );
  }

  sortData(sort: Sort): void {
    const data = this.filteredUsers.slice();

    if (!sort.active || sort.direction === '') {
      this.filteredUsers = data;
      return;
    }

    this.filteredUsers = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'fullName':
          return this.compare(
            `${a.firstName} ${a.lastName}`,
            `${b.firstName} ${b.lastName}`,
            isAsc
          );
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  viewUser(user: User): void {
    /*Implementar una navegacion con routes a /intranet/paciente/su id/*/
  }

}
