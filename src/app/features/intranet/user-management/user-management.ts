import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { UserService, CreateUserDto } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-management',
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
    MatSortModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['email', 'fullName', 'role', 'actions'];
  searchTerm = '';
  showCreateForm = false;
  createUserForm: FormGroup;
  loading = false;

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'RECEPTIONIST', label: 'Recepcionista' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['DOCTOR', Validators.required]
    });
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
      user.lastName.toLowerCase().includes(searchValue) ||
      user.role.toLowerCase().includes(searchValue)
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
        case 'role':
          return this.compare(a.role, b.role, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.createUserForm.reset({ role: 'DOCTOR' });
    }
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const userData: CreateUserDto = this.createUserForm.value;

    this.userService.createUser(userData).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.filteredUsers = [...this.users];
        this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
        this.toggleCreateForm();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Error al crear usuario';
        this.snackBar.open(message, 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    // Pendiente de implementación
    this.snackBar.open('Función de eliminar pendiente de implementación', 'Cerrar', {
      duration: 3000
    });
  }

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find(r => r.value === role.toUpperCase());
    return roleObj ? roleObj.label : role;
  }

  getErrorMessage(field: string): string {
    const control = this.createUserForm.get(field);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control?.hasError('email')) {
      return 'Ingresa un email válido';
    }

    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    return '';
  }
}
