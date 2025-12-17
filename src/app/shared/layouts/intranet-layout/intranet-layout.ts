import { Component } from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-intranet-layout',
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, RouterOutlet, MatButtonModule, RouterLink],
  templateUrl: './intranet-layout.html',
  styleUrl: './intranet-layout.css',
})
export class IntranetLayout {

  constructor(private auth: AuthService) {}

  get user() {
    return this.auth.currentUser;
  }

  get role(): string | null {
    return this.auth.getRole();
  }

  logout(): void {
    this.auth.logout();
    location.href = '/login';
  }
}


