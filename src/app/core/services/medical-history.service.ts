import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private readonly API_URL = `${environment.apiUrl}medical-history`;

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


  //NOTAS
  getEvolutions(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/evolution/${patientId}`);
  }

  createEvolution(patientId: number, data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/evolution/${patientId}`, data);
  }

  updateEvolution(id: number, content: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/evolution/${id}`, { content });
  }

  deleteEvolution(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/evolution/${id}`);
  }

  //SIGNOS VITALES

  getVitalSigns(patientId: number): Observable<any[]> {
    // Se agrega /medical-history/ antes de /vital-signs/
    return this.http.get<any[]>(`${this.API_URL}/vital-signs/${patientId}`);
  }

  saveVitalSigns(patientId: number, data: any): Observable<any> {
    // Se agrega /medical-history/ antes de /vital-signs/
    return this.http.post(`${this.API_URL}/vital-signs/${patientId}`, data);
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
