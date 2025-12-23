import {Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface Review {
  profilePhotoUrl: string;
  authorName: string;
  relativeTimeDescription: string;
  rating: number;
  text: string;
  expanded?: boolean; // ← NUEVO: para controlar si está expandido
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

  // Datos de prueba para testimonios (simulando API de Google)
  reviews: Review[] = [
    {
      profilePhotoUrl: 'https://i.pravatar.cc/150?img=1',
      authorName: 'Carmen Quiroz',
      relativeTimeDescription: 'Hace 1 año',
      rating: 5,
      text: 'Muy contenta con el profesionalismo del Dr. Revollar y su staff amable y paciente. Acabó mi tratamiento y los volvería a elegir para cualquier otra consulta. Recomiendo al 100% al Dr. Revollar y su equipo!',
      expanded: false // ← NUEVO
    },
    {
      profilePhotoUrl: 'https://i.pravatar.cc/150?img=5',
      authorName: 'Corita Farías de Souza',
      relativeTimeDescription: 'Hace 1 año',
      rating: 5,
      text: 'Nunca me había sentido tan cómoda, satisfecha y feliz en una clínica 💚. Recomiendo al 1000% al Dr. Revollar, Jesús es un crack! Totalmente agradecida con él y su equipo de trabajo.',
      expanded: false
    },
    {
      profilePhotoUrl: 'https://i.pravatar.cc/150?img=9',
      authorName: 'Pierina Broncano',
      relativeTimeDescription: 'Hace 1 año',
      rating: 5,
      text: 'Excelente servicio. Jesús es un crack y las chicas del staff súper lindas y amables. Gran Team!!',
      expanded: false
    },
    {
      profilePhotoUrl: 'https://i.pravatar.cc/150?img=8',
      authorName: 'Stephany Bravo',
      relativeTimeDescription: 'Hace 1 año',
      rating: 5,
      text: 'El Dr. Jesús Revollar es un gran profesional y una persona muy empática. Tiene mucha paciencia para escuchar, explicar y responder todas las dudas que uno tenga.',
      expanded: false
    },
    {
      profilePhotoUrl: 'https://i.pravatar.cc/150?img=12',
      authorName: 'Luis Martínez',
      relativeTimeDescription: 'Hace 2 meses',
      rating: 5,
      text: 'Increíble atención desde la primera consulta. El equipo es muy profesional y las instalaciones son de primera. Totalmente recomendado.',
      expanded: false
    },
    {
      profilePhotoUrl: 'https://i.pravatar.cc/150?img=15',
      authorName: 'Andrea Silva',
      relativeTimeDescription: 'Hace 3 semanas',
      rating: 5,
      text: 'Me realizaron carillas dentales y el resultado superó mis expectativas. El Dr. Revollar es un artista. Muy agradecida con todo el equipo!',
      expanded: false
    }
  ];

  currentSlide = 0;
  private intervalId: any;

  // Variables para el carrusel de testimonios
  currentReviewIndex = 0;
  reviewsPerPage = 4;
  isAnimating = false; // ← NUEVO: para controlar la animación

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.startCarousel();
    this.updateReviewsPerPage();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges();
    }, 5000);
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

  scrollReviews(direction: 'left' | 'right') {
    if (this.isAnimating) return; // Evitar múltiples clics durante la animación

    if (direction === 'left' && this.canScrollLeft) {
      this.isAnimating = true;
      this.currentReviewIndex--;
      setTimeout(() => this.isAnimating = false, 500); // Duración de la animación
    } else if (direction === 'right' && this.canScrollRight) {
      this.isAnimating = true;
      this.currentReviewIndex++;
      setTimeout(() => this.isAnimating = false, 500);
    }
  }

  // ← NUEVO: Toggle para expandir/contraer texto
  toggleReviewText(review: Review) {
    review.expanded = !review.expanded;
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
      this.reviewsPerPage = 1;
    } else if (width < 992) {
      this.reviewsPerPage = 2;
    } else if (width < 1200) {
      this.reviewsPerPage = 3;
    } else {
      this.reviewsPerPage = 4;
    }
    // Ajustar el índice si es necesario
    if (this.currentReviewIndex + this.reviewsPerPage > this.reviews.length) {
      this.currentReviewIndex = Math.max(0, this.reviews.length - this.reviewsPerPage);
    }
  }
}
