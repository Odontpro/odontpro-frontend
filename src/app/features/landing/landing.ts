import {Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../shared/models/review.model';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing implements OnInit, OnDestroy {
  slides: Slide[] = [
    {
      image: 'slider/slider1.jpg',
      title: 'Especialistas en',
      subtitle: 'ESTÉTICA DENTAL'
    },
    {
      image: 'slider/slider2.jpg',
      title: 'LUCE TU MEJOR',
      subtitle: 'SONRISA'
    },
    {
      image: 'slider/slider3.jpg',
      title: 'Cuidamos',
      subtitle: 'TU SALUD ORAL'
    }
  ];

  reviews: Review[] = [];

  currentSlide = 0;
  private intervalId: any;

  // Variables para el carrusel de testimonios
  currentReviewIndex = 0;
  reviewsPerPage = 4;

  constructor(private cdr: ChangeDetectorRef, private reviewService: ReviewService) {}

  ngOnInit() {
    this.startCarousel();
    this.updateReviewsPerPage();
    this.loadReviews();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.currentReviewIndex = 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fallo en obtener datos de Google, cargando datos de respaldo', err);

        // Cargar data de fallback en caso de error
        this.reviews = [
          {
            "profilePhotoUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXYT9cZ_yirDMdWuBzEWB6r_XIKe6QiYPjrLSiFLl1m9Ev-2LQ=s128-c0x00000000-cc-rp-mo-ba3",
            "authorName": "Carlos Rodriguez Sarlis",
            "relativeTimeDescription": "Hace 2 semanas",
            "rating": 5,
            "text": "Fui porque un amigo me lo recomendó y porque está en un área muy céntrica.\nMe sorprendió lo moderno que es y la tecnología que tienen para atenderte. Literalmente no necesitas ir a otro sitio porque allí te hacen todo lo que necesitas.",
            "expanded": false
          },
          {
            "profilePhotoUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXur1KDgbX7pFKl_5ypObYMjdaKtqR_3VqtOSsTfaEoaJfTiI70=s128-c0x00000000-cc-rp-mo",
            "authorName": "Jorge (Jorge)",
            "relativeTimeDescription": "Hace 2 semanas",
            "rating": 5,
            "text": "Estuve gratamente sorprendido con este moderno consultorio. Lo que más me sorprendió es que tienen una maquina que toma rayos-x (asumo) instantáneos en la misma silla de dentista y te los muestra en la pantalla. En mi anterior dentista tenía que ir a otro consultorio, pagar por la radiografia, esperar resultados, y luego continuar con el proceso. No sabía que esta tecnología existía y verdaderamente ahorra tiempo y dinero.",
            "expanded": false
          },
          {
            "profilePhotoUrl": "https://lh3.googleusercontent.com/a/ACg8ocLFZzNyVU6zZlKVfUvDy1QVoI_bHDHQ2UNDErcanug7eoISci0=s128-c0x00000000-cc-rp-mo",
            "authorName": "Wilmer Nolasco Lazaro",
            "relativeTimeDescription": "Hace 2 semanas",
            "rating": 5,
            "text": "Muy buena Clínica equipos modernos me tomaron fotos del tratamiento y bueno muy recomendable en la atención.",
            "expanded": false
          },
          {
            "profilePhotoUrl": "https://lh3.googleusercontent.com/a/ACg8ocJpEYBphWGkbD3oRdW0V6UZd-3rBMa4p1pdgyID7jcH8S1VZA=s128-c0x00000000-cc-rp-mo",
            "authorName": "SYD RA",
            "relativeTimeDescription": "Hace 2 semanas",
            "rating": 5,
            "text": "Excelente trabajo, super amables!",
            "expanded": false
          },
          {
            "profilePhotoUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXg6dVDGQ_haylAdWFA7SrLFS0f3elmOJ199FgV3_bN_bHyLgr_=s128-c0x00000000-cc-rp-mo-ba2",
            "authorName": "Carlos Pino",
            "relativeTimeDescription": "Hace 2 semanas",
            "rating": 5,
            "text": "Excelente servicio y muy profesionales",
            "expanded": false
          }
        ];

        this.currentReviewIndex = 0;
        this.cdr.detectChanges(); // Forzar actualización de la vista con el fallback
      },
    });
  }


  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges();
    }, 5000);
  }

  scheduleMeet() {
    window.open(
      'https://wa.me/51901222854?text=Hola%20quiero%20agendar%20una%20cita',
      '_blank'
    );
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Métodos para testimonios
  get visibleReviews(): Review[] {
    return this.reviews.slice(this.currentReviewIndex, this.currentReviewIndex + this.reviewsPerPage);
  }

  get canScrollLeft(): boolean {
    return this.currentReviewIndex > 0;
  }

  get canScrollRight(): boolean {
    return this.currentReviewIndex + this.reviewsPerPage < this.reviews.length;
  }

  toggleReviewText(index: number) {
    this.reviews[index].expanded = !this.reviews[index].expanded;
  }

  scrollReviews(direction: 'left' | 'right') {
    if (direction === 'left' && this.canScrollLeft) {
      this.currentReviewIndex--;
    } else if (direction === 'right' && this.canScrollRight) {
      this.currentReviewIndex++;
    }
  }

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateReviewsPerPage();
  }

  private updateReviewsPerPage() {
    const width = window.innerWidth;
    if (width < 768) {
      this.reviewsPerPage = 1; // 1 tarjeta ocupa el 100% del contenedor
    } else if (width < 992) {
      this.reviewsPerPage = 2; // 2 tarjetas ocupan 50% cada una
    } else if (width < 1200) {
      this.reviewsPerPage = 3;
    } else {
      this.reviewsPerPage = 4;
    }

    // Seguridad: que el índice no se pase del límite
    if (this.currentReviewIndex + this.reviewsPerPage > this.reviews.length) {
      this.currentReviewIndex = Math.max(0, this.reviews.length - this.reviewsPerPage);
    }
  }
}
