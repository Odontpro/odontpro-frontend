import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private readonly API_URL = 'http://localhost:3000/medical-history';

  constructor(private http: HttpClient) {}

  // --- ODONTOPEDIATRÍA ---

  // Obtener datos existentes
  getPediatric(patientId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/pediatric/${patientId}`);
  }

  // Actualizar o crear datos
  updatePediatric(patientId: number, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/pediatric/${patientId}`, data);
  }

  // --- ODONTOLOGÍA GENERAL (NUEVO) ---

  // Obtener datos de odontología general
  getDentistry(patientId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/dentistry/${patientId}`);
  }

  // Actualizar o crear odontología general
  updateDentistry(patientId: number, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/dentistry/${patientId}`, data);
  }

  // --- ENDODONCIA ---

  // Obtener datos de endodoncia
  getEndodontics(patientId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/endodontics/${patientId}`);
  }

  // Actualizar o crear endodoncia
  updateEndodontics(patientId: string, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/endodontics/${patientId}`, data);
  }
}
