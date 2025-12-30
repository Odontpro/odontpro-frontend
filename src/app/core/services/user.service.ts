import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { User } from '../../shared/models/user.model';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
}

export interface BackendUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) {}

  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<BackendUserResponse>(this.apiUrl, userData).pipe(
      map(response => this.transformBackendUser(response)),
      catchError(error => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<BackendUserResponse[]>(this.apiUrl).pipe(
      map(users => users.map(user => this.transformBackendUser(user))),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }

  deleteUser(userId: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error deleting user:', error);
        return of(false);
      })
    );
  }

  private transformBackendUser(backendUser: BackendUserResponse): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      role: backendUser.role.toLowerCase()
    };
  }
}
