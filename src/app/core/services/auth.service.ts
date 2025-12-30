import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CryptoService } from './crypto.service';
import { User } from '../../shared/models/user.model';
import { environment } from './environment';

export interface LoginDto {
  email: string;
  password: string;
}

export interface BackendUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface BackendAuthResponse {
  accessToken: string;
  user: BackendUser;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}auth`;

  constructor(
    private http: HttpClient,
    private crypto: CryptoService
  ) {}

  get currentUser(): User | null {
    return this.crypto.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getRole(): string | null {
    return this.currentUser?.role ?? null;
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        // Guardar datos encriptados en localStorage
        localStorage.setItem('odont-user', this.crypto.encrypt(response));
        console.log(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('odont-user');
  }

  getToken(): string | null {
    /*const encryptedData = localStorage.getItem('odont-user');
    if (!encryptedData) return null;

    try {
      const data = this.crypto.decrypt(encryptedData);
      return data?.token ?? null;
    } catch {
      return null;
    }*/
    return null;
  }
}
