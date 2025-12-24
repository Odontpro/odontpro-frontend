import { Component, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router, RouterModule, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ViewportScroller } from '@angular/common';

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
export class PublicLayout implements OnInit, AfterViewInit {
  isScrolled = false;
  isLandingPage = true;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('sidenavContent') sidenavContent: any;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    // Detectar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkIfLandingPage();

      // Manejar el scroll a fragmentos manualmente
      setTimeout(() => {
        const tree = this.router.parseUrl(event.urlAfterRedirects);
        if (tree.fragment) {
          this.scrollToFragment(tree.fragment);
        }
      }, 100);
    });

    // Verificar la ruta inicial
    this.checkIfLandingPage();
  }

  ngAfterViewInit() {
    // Manejar fragmento inicial si existe
    const tree = this.router.parseUrl(this.router.url);
    if (tree.fragment) {
      setTimeout(() => {
        if (tree.fragment) { // ← Segunda verificación dentro del setTimeout
          this.scrollToFragment(tree.fragment);
        }
      }, 100);
    }
  }

  checkIfLandingPage() {
    // Considera landing page solo si está en la raíz "/"
    this.isLandingPage = this.router.url === '/' || this.router.url.startsWith('/#');
  }

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

  // Método para hacer scroll al fragmento dentro del mat-sidenav-content
  private scrollToFragment(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      const sidenavContent = document.querySelector('mat-sidenav-content');
      if (sidenavContent) {
        const elementPosition = element.offsetTop;
        sidenavContent.scrollTo({
          top: elementPosition - 80, // 80px offset para el header fijo
          behavior: 'smooth'
        });
      }
    }
  }
}
