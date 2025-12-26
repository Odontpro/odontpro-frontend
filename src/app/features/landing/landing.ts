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
      console.error('Failed to load reviews', err);
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
