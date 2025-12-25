import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { Review } from '../../shared/models/review.model';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}google-reviews`;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
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
      catchError((error) => {
        console.error('Error loading reviews:', error);
        return throwError(() => error);
      })
    );
  }
}
