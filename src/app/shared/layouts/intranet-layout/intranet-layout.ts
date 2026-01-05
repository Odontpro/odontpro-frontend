import { Component, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CryptoService } from '../../../core/services/crypto.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intranet-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    RouterOutlet,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './intranet-layout.html',
  styleUrl: './intranet-layout.css',
})
export class IntranetLayout {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile: boolean = false;
  isTablet: boolean = false;

  constructor(private auth: AuthService, private cryptoService: CryptoService) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width < 1024; // Cambié a 1024 para que el navbar se muestre desde tablet en adelante
    this.isTablet = width >= 768 && width < 1024;
  }

  get user() {
    return this.cryptoService.getCurrentUser();
  }

  get role(): string | null {
    return this.cryptoService.getUserRole();
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  closeSidenavOnMobile() {
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    console.log('Búsqueda:', query);
  }

  logout(): void {
    this.auth.logout();
    location.href = '/login';
  }
}
