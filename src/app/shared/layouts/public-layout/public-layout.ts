import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router, RouterModule, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSidenavModule
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout implements OnInit {
  isScrolled = false;
  isLandingPage = true;

  @ViewChild('sidenav') sidenav!: MatSidenav;


  constructor(private router: Router) {}

  ngOnInit() {
    // Detectar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkIfLandingPage();
    });

    // Verificar la ruta inicial
    this.checkIfLandingPage();
  }

  checkIfLandingPage() {
    // Considera landing page solo si está en la raíz "/"
    this.isLandingPage = this.router.url === '/' || this.router.url.startsWith('/#');
  }

  // ← CAMBIADO: Escuchar scroll en el sidenav-content en lugar de window
  onContentScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollPosition = target.scrollTop;

    // Solo aplicar efecto de scroll si estamos en la landing
    if (this.isLandingPage) {
      this.isScrolled = scrollPosition > 100;
    } else {
      // Si no estamos en landing, siempre mostrar header sólido
      this.isScrolled = true;
    }
  }
}
