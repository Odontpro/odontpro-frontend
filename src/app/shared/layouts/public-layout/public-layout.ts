import { Component, HostListener, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router, RouterModule, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout implements OnInit {
  isScrolled = false;
  isLandingPage = true;

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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Solo aplicar efecto de scroll si estamos en la landing
    if (this.isLandingPage) {
      this.isScrolled = window.scrollY > 100;
    } else {
      // Si no estamos en landing, siempre mostrar header sólido
      this.isScrolled = true;
    }
  }
}
