import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { Complaint } from '../../shared/models/complaint.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ComplaintService {
  private apiUrl = `${environment.apiUrl}complaints`;

  constructor(private http: HttpClient) {}

  createComplaint(data: Complaint): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError(error => {
        console.error('Error enviando reclamo:', error);
        return throwError(() => error);
      })
    );
  }
}
