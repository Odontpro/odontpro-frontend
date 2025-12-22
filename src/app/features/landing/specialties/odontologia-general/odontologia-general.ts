import { Component, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Caso {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagenAntes: string;
  imagenDespues: string;
}

@Component({
  selector: 'app-odontologia-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odontologia-general.html',
  styleUrl: './odontologia-general.css',
})
export class OdontologiaGeneral implements OnDestroy {

  isMuted = true;

  casos: Caso[] = [
    {
      id: 1,
      titulo: 'SONRISAS',
      subtitulo: 'TOP',
      descripcion: 'Una paciente insatisfecha con sus carillas de resina nos visitó en busca de un cambio. Decidimos mejorar su sonrisa diseñando y colocando 10 carillas de cerámica ultrafinas. El resultado fue una sonrisa más natural y estética.',
      imagenAntes: 'odontologia-general/OG-C1-ANTES.png',
      imagenDespues: 'odontologia-general/OG-C1-DESPUES.png'
    },
    {
      id: 2,
      titulo: 'SONRISAS',
      subtitulo: 'TOP',
      descripcion: 'Paciente con múltiples caries y desgaste dental. Se realizó un tratamiento integral con restauraciones y carillas.',
      imagenAntes: 'odontologia-general/OG-C1-ANTES.png',
      imagenDespues: 'odontologia-general/OG-C1-DESPUES.png'
    },
  ];

  casoActual = 0;
  sliderPosition = 50;
  isDragging = false;
  isAnimating = false;

  constructor(private ngZone: NgZone) {}

  get casoSeleccionado(): Caso {
    return this.casos[this.casoActual];
  }

  seleccionarCaso(index: number) {
    this.casoActual = index;
    this.sliderPosition = 50;
  }

  onMouseDown(event: MouseEvent) {
    // Evitar que el drag se active si se hace click en los labels
    const target = event.target as HTMLElement;
    if (target.classList.contains('image-label') || target.closest('.image-label')) {
      return;
    }

    event.preventDefault();
    this.isDragging = true;
    this.updateSliderPosition(event);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();
      this.updateSliderPosition(event);
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  // Click en cualquier parte de la imagen para mover el slider
  onImageClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Si se hace click en el handle o en los labels, no hacer nada
    if (target.closest('.slider-handle') || target.closest('.image-label')) {
      return;
    }

    // Solo mover si no estamos arrastrando
    if (!this.isDragging) {
      this.updateSliderPosition(event);
    }
  }

// Click en el label "Antes" - mueve el slider completamente a la derecha
  onAntesClick(event: MouseEvent) {
    event.stopPropagation();
    this.animateSlider(100);
  }

  // Click en el label "Después" - mueve el slider completamente a la izquierda
  onDespuesClick(event: MouseEvent) {
    event.stopPropagation();
    this.animateSlider(0);
  }

  // Anima el slider hacia una posición específica con mejor rendimiento
  private animateSlider(targetPosition: number) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const startPosition = this.sliderPosition;
    const distance = targetPosition - startPosition;
    const duration = 400; // Reducido a 400ms para mayor velocidad
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Función de easing más suave
      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // NgZone.run fuerza el change detection
      this.ngZone.run(() => {
        this.sliderPosition = startPosition + (distance * easeProgress);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.ngZone.run(() => {
          this.sliderPosition = targetPosition;
          this.isAnimating = false;
        });
      }
    };

    requestAnimationFrame(animate);
  }

  private updateSliderPosition(event: MouseEvent) {
    const container = (event.target as HTMLElement).closest('.image-comparison');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    this.sliderPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
  }

  toggleSound(video: HTMLVideoElement) {
    this.isMuted = false;
    video.muted = false;
    video.volume = 1;
  }


  ngOnDestroy() {
    this.isDragging = false;
    if ((this as any)._moveHandler) {
      document.removeEventListener('mousemove', (this as any)._moveHandler);
      document.removeEventListener('mouseup', (this as any)._upHandler);
    }
  }
}
