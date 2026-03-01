import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-floating-actions',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <button
      class="top-btn"
      [class.top-visible]="showTop"
      (click)="scrollToTop()">
      <mat-icon>keyboard_arrow_up</mat-icon>
      <span>SUBIR</span>
    </button>
  `,
  styles: [`
    .top-btn {
      position: fixed;
      top: 100px;
      right: 25px;
      background-color: #7dc0bf;
      color: white;
      padding: 10px 15px;
      font-weight: bold;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 5px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      visibility: hidden;
      transform: translateX(100px);
    }
    .top-btn.top-visible {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }
  `]
})
export class FloatingActionsComponent implements OnInit, OnDestroy {
  @Input() scrollContainer!: any; // Recibe el mat-sidenav-content
  showTop = false;
  private lastScrollTop = 0;

  ngOnInit() {
    if (this.scrollContainer) {
      // Escuchamos el evento de scroll directamente del contenedor
      this.scrollContainer.getElementRef().nativeElement.addEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = (event: any) => {
    const current = event.target.scrollTop;

    // Tu lógica: Mostrar si baja de 300 y ocultar si sube
    if (current > 500 && current > this.lastScrollTop) {
      this.showTop = true;
    } else if (current < this.lastScrollTop) {
      this.showTop = false;
    }
    this.lastScrollTop = current;
  };

  scrollToTop() {
    this.scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy() {
    if (this.scrollContainer) {
      this.scrollContainer.getElementRef().nativeElement.removeEventListener('scroll', this.handleScroll);
    }
  }
}
