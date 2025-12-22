import {Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

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

  currentSlide = 0;
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges(); // ← Forzar detección de cambios
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
