import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import {Patient, PatientTag} from '../../shared/models/patient.model';
import {Observable, of, Subject} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {Appointment} from '../../shared/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}patients`;

  private patientCreatedSource = new Subject<Patient>();
  patientCreated$ = this.patientCreatedSource.asObservable();

  constructor(private http: HttpClient) { }

  notifyPatientCreated(patient: Patient) {
    this.patientCreatedSource.next(patient);
  }

  // Tags predefinidas para pacientes
  private patientTags: PatientTag[] = [
    { id: 1, nombre: 'Impuntual', color: '#d32f2f', backgroundColor: '#ffebee' },
    { id: 2, nombre: 'VIP', color: '#f57c00', backgroundColor: '#fff3e0' },
    { id: 3, nombre: 'Primera vez', color: '#1976d2', backgroundColor: '#e3f2fd' },
    { id: 4, nombre: 'Tratamiento largo', color: '#7b1fa2', backgroundColor: '#f3e5f5' },
    { id: 5, nombre: 'Requiere seguimiento', color: '#388e3c', backgroundColor: '#e8f5e9' }
  ];

  getPatients(): Observable<Patient[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(patients => patients.map(p => this.mapToPatient(p)))
    );
  }

  updatePatient(id: number| undefined, data: Partial<Patient>): Observable<Patient> {
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

  getPatientTags(ids: any[]): Observable<PatientTag[]> {

    // Convertimos todos los IDs a números para asegurar la comparación
    const numericIds = ids.map(id => Number(id));

    const filteredTags = this.patientTags.filter(tag => {
      const isIncluded = numericIds.includes(tag.id);
      // Log opcional para ver cada comparación
      // console.log(`Evaluando tag ${tag.id} (${tag.nombre}): ${isIncluded}`);
      return isIncluded;
    });

    return of(filteredTags).pipe(delay(100));
  }
}
