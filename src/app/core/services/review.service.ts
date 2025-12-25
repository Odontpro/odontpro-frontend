import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { Review } from '../../shared/models/review.model';
import { Observable, of, map, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}google-reviews`;
  private readonly STORAGE_KEY = 'google_reviews';

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
    const cached = localStorage.getItem(this.STORAGE_KEY);

    // 1️⃣ Si existe cache → devolverlo
    if (cached) {
      console.log("Obteniendo reviews del localStorage")
      try {
        const reviews: Review[] = JSON.parse(cached);
        return of(reviews);
      } catch (e) {
        console.warn('Invalid cache, clearing localStorage');
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }

    // 2️⃣ No hay cache → llamar al backend
    
    console.log("Obteniendo reviews del backend")
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((reviews) =>
        reviews.map((r) => ({
          profilePhotoUrl: r.avatar,
          authorName: r.authorName,
          relativeTimeDescription: r.timeAgo,
          rating: r.rating,
          text: r.comment,
          expanded: false,
        }))
      ),

      // 3️⃣ Guardar en localStorage
      tap((reviews) => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));
      }),

      catchError((error) => {
        console.error('Error loading reviews:', error);
        return throwError(() => error);
      })
    );
  }
}
