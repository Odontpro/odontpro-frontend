// services/appointment.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentFilters,
  Doctor,
} from '../../shared/models/appointment.model';
import { Subject } from 'rxjs';
import {availableTags, Patient, PatientTag} from '../../shared/models/patient.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from './environment';
import { map } from 'rxjs/operators';
import { User} from '../../shared/models/user.model';
import {CryptoService} from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}appointments`;

  private appointmentCreatedSource = new Subject<Appointment>();
  appointmentCreated$ = this.appointmentCreatedSource.asObservable();

  // Tags predefinidas para pacientes
  private patientTags: PatientTag[] = [
    { id: 1, nombre: 'Impuntual', color: '#d32f2f', backgroundColor: '#ffebee' },
    { id: 2, nombre: 'VIP', color: '#f57c00', backgroundColor: '#fff3e0' },
    { id: 3, nombre: 'Primera vez', color: '#1976d2', backgroundColor: '#e3f2fd' },
    { id: 4, nombre: 'Tratamiento largo', color: '#7b1fa2', backgroundColor: '#f3e5f5' },
    { id: 5, nombre: 'Requiere seguimiento', color: '#388e3c', backgroundColor: '#e8f5e9' }
  ];

  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  notifyAppointmentCreated(appointment: Appointment) {
    this.appointmentCreatedSource.next(appointment);
  }

  getAppointments(filters?: AppointmentFilters): Observable<Appointment[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.doctorId) params = params.set('doctorId', filters.doctorId.toString());
      if (filters.patientId) params = params.set('patientId', filters.patientId.toString());
      if (filters.branch) params = params.set('branch', filters.branch);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.specialty) params = params.set('specialty', filters.specialty);

      // USAMOS EL HELPER EN LUGAR DE toISOString()
      if (filters.startDate) {
        params = params.set('startDate', this.formatDateLocal(filters.startDate));
      }
      if (filters.endDate) {
        params = params.set('endDate', this.formatDateLocal(filters.endDate));
      }
    }

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map(res => res.map(item => this.mapToAppointment(item)))
    );
  }

  private formatDateLocal(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Obtener cita por ID
  /*getAppointmentById(id: number): Observable<Appointment | undefined> {
    const appointment = this.appointments.find(a => a.id === id);
    return of(appointment).pipe(delay(200));
  }*/

  createAppointment(data: CreateAppointmentDto): Observable<Appointment> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map(res => this.mapToAppointment(res))
    );
  }

  private mapToAppointment(data: any): Appointment {
    const safeDate = typeof data.date === 'string' ? data.date.replace(/-/g, '/') : data.date;

    return {
      ...data,
      date: new Date(safeDate),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      // Si el backend envía el paciente/doctor, el spread (...data) los incluye,
      // pero nos aseguramos de que el paciente también tenga sus fechas como Date si es necesario
      patient: data.patient ? {
        ...data.patient,
        createdAt: new Date(data.patient.createdAt),
        updatedAt: new Date(data.patient.updatedAt)
      } : undefined,
      doctor: data.doctor ? { ...data.doctor } : undefined
    };
  }

  updateAppointment(id: number | undefined, data: UpdateAppointmentDto): Observable<Appointment> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.patch<any>(url, data).pipe(
      map(res => this.mapToAppointment(res))
    );
  }

  deleteAppointment(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDoctors(): Observable<User[]> {
    const token = this.cryptoService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Ahora llamamos al endpoint real del módulo de usuarios
    return this.http.get<User[]>(`${environment.apiUrl}users/doctors`,{ headers });
  }

  getAppointmentsByPatientId(patientId: number): Observable<Appointment[]> {
    const url = `${this.apiUrl}/patient/${patientId}`;

    return this.http.get<any[]>(url).pipe(
      map((response: any[]) => {
        return response.map(appointment => this.mapToAppointment(appointment));
      })
    );
  }

  getPatientTags(): Observable<PatientTag[]> {
    return of(this.patientTags).pipe(delay(100));
  }

}
