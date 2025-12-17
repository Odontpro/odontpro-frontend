import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {User} from '../../../shared/models/user.model';
import {Router} from '@angular/router';
import {CryptoService} from '../../../core/services/crypto.service';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private crypto: CryptoService,
    private router: Router
  ) {}

  login(): void {

    // 🔹 Usuario ficticio para probar flujo
    const user: User = {
      id: 1,
      email: 'admin@odontpro.com',
      first_name: 'Admin',
      last_name: 'OdontPro',
      role: 'admin'
    };

    const currentUser = {
      token: 'fake-jwt-token',
      user
    };

    localStorage.setItem(
      'odont-user',
      this.crypto.encrypt(currentUser)
    );

    // 🔁 Redirigir a intranet
    this.router.navigate(['/intranet/']);
  }
}
