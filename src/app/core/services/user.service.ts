import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from './environment';
import { User } from '../../shared/models/user.model';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import {CryptoService} from './crypto.service';
import {CreateUserDto} from '../../shared/dto/create-user.dto';
import { UpdateUserDto } from '../../shared/dto/update-user.dto';

export interface BackendUserResponse {
  id: number;
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

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  createUser(userData: CreateUserDto): Observable<User> {
    const token = this.cryptoService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<BackendUserResponse>(this.apiUrl, userData, { headers }).pipe(
      map(response => this.transformBackendUser(response)),
      catchError(error => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    const token = this.cryptoService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<BackendUserResponse[]>(this.apiUrl+"/active", {headers}).pipe(
      map(users => users.map(user => this.transformBackendUser(user))),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }

  updateUser(userId: number, userData: UpdateUserDto): Observable<User> {
    const token = this.cryptoService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<BackendUserResponse>(`${this.apiUrl}/${userId}`, userData, { headers }).pipe(
      map(response => this.transformBackendUser(response)),
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }

  deleteUser(userId: number): Observable<boolean> {
    const token = this.cryptoService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log("deleteUser")

    return this.http.delete(`${this.apiUrl}/${userId}`, {headers}).pipe(
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
