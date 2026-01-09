import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { Patient } from '../../shared/models/patient.model';
import {Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {Appointment} from '../../shared/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}patients`;

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(patients => patients.map(p => this.mapToPatient(p)))
    );
  }

  updatePatient(id: number, data: Partial<Patient>): Observable<Patient> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => this.mapToPatient(response))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => this.mapToPatient(p))
    );
  }

  createPatient(patient: Partial<Patient>): Observable<Patient> {
    return this.http.post<any>(this.apiUrl, patient).pipe(
      map(p => this.mapToPatient(p))
    );
  }

  private mapToPatient(data: any): Patient {
    return {
      ...data,
      // Convertimos los IDs de etiquetas a números por si vienen como strings
      tags: data.tags ? data.tags.map((t: string | number) => Number(t)) : [],
      // Aseguramos que las fechas sean objetos Date de JS
      birthDate: data.birthDate ? new Date(data.birthDate + 'T00:00:00') : undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }
}
