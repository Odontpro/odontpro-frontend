import {CryptoService} from './crypto.service';
import {User} from '../../shared/models/user.model';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private crypto: CryptoService) {}

  get currentUser(): User | null {
    return this.crypto.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getRole(): string | null {
    return this.currentUser?.role ?? null;
  }

  logout(): void {
    localStorage.removeItem('odont-user');
  }
}
