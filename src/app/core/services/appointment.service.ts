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
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './environment';
import { map } from 'rxjs/operators';

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

  // Doctores de prueba
  private doctors: Doctor[] = [
    {
      id: 1,
      nombre: 'Carlos',
      apellido: 'Rodriguez',
      color: '#2196F3',
      especialidades: ['Ortodoncia', 'Odontología General']
    },
    {
      id: 2,
      nombre: 'Roberto',
      apellido: 'Prueba',
      color: '#E91E63',
      especialidades: ['Endodoncia', 'Periodoncia']
    },
    {
      id: 3,
      nombre: 'Homero',
      apellido: 'Prueba',
      color: '#4CAF50',
      especialidades: ['Cirugía', 'Implantología']
    }
  ];

  // Pacientes de prueba
  private patients: Patient[] = [
    {
      id: 1,
      documentType: 'DNI',
      documentNumber: '72458930',
      hasNoDocument: false,
      firstName: 'Romeo',
      lastNamePaternal: 'Prueba',
      lastNameMaternal: 'García',
      phonePrefix: '+51',
      phoneNumber: '916623244',
      hasNoPhone: false,
      email: 'romeo@example.com',
      gender: 'MALE',
      bloodGroup: 'O+',
      tags: [1, 2], // IDs de 'Nuevo' y 'VIP'
      hasGuardian: false,
      generalNote: 'Paciente referido de la sucursal Norte. Requiere control mensual.',
      createdAt: new Date('2026-01-01T10:00:00'),
      updatedAt: new Date('2026-01-01T10:00:00')
    },
    {
      id: 2,
      documentType: 'DNI',
      documentNumber: '12345678',
      hasNoDocument: false,
      firstName: 'Julieta',
      lastNamePaternal: 'Prueba',
      lastNameMaternal: 'Sánchez',
      phonePrefix: '+51',
      phoneNumber: '987654321',
      hasNoPhone: false,
      email: 'julieta@example.com',
      gender: 'FEMALE',
      bloodGroup: 'A+',
      tags: [3], // ID de 'Impuntual'
      hasGuardian: false,
      birthDate: new Date('1998-05-20'),
      generalNote: 'Primera vez en el consultorio.',
      createdAt: new Date('2026-01-02T11:30:00'),
      updatedAt: new Date('2026-01-02T11:30:00')
    },
    {
      id: 3,
      documentType: 'PASAPORTE',
      documentNumber: 'A98765432',
      hasNoDocument: false,
      firstName: 'Homero',
      lastNamePaternal: 'Prueba',
      lastNameMaternal: 'Simpson',
      phonePrefix: '+51',
      phoneNumber: '912345678',
      hasNoPhone: false,
      gender: 'OTHER',
      bloodGroup: 'B+',
      tags: [4], // ID de 'Fidelizado'
      hasGuardian: true,
      generalNote: 'Tratamiento de ortodoncia largo plazo.',
      createdAt: new Date('2026-01-03T09:15:00'),
      updatedAt: new Date('2026-01-03T09:15:00')
    }
  ];

  private appointments: Appointment[] = [
  {
    id: 1,
    branch: 'Principal',
    officeId: 1,
    patientId: 1,
    doctorId: 1,
    specialty: 'Ortodoncia',
    reason: 'Control mensual',
    duration: 60,
    status: AppointmentStatus.CONFIRMADA,
    date: new Date('2026-01-04'),
    startTime: '09:00',
    notes: 'Paciente requiere ajuste de brackets',
    createdAt: new Date('2026-01-03T10:00:00Z'),
    updatedAt: new Date('2026-01-03T10:00:00Z')
  },
  {
    id: 2,
    branch: 'Principal',
    officeId: 2,
    patientId: 2,
    doctorId: 2,
    specialty: 'Endodoncia',
    reason: 'Tratamiento de conducto',
    duration: 90,
    status: AppointmentStatus.CONFIRMADA,
    date: new Date('2026-01-03'),
    startTime: '11:00',
    notes: '',
    createdAt: new Date('2026-01-03T11:00:00Z'),
    updatedAt: new Date('2026-01-03T11:00:00Z')
  },
  {
    id: 3,
    branch: 'Principal',
    officeId: 1,
    patientId: 3,
    doctorId: 3,
    specialty: 'Cirugía',
    reason: 'Extracción de muela',
    duration: 45,
    status: AppointmentStatus.PENDIENTE,
    date: new Date('2026-01-03'),
    startTime: '11:00',
    notes: '',
    createdAt: new Date('2026-01-03T12:00:00Z'),
    updatedAt: new Date('2026-01-03T12:00:00Z')
  },
  {
    id: 4,
    branch: 'Principal',
    officeId: 2,
    patientId: 2,
    doctorId: 2,
    specialty: 'Endodoncia',
    reason: 'Seguimiento de conducto',
    duration: 60,
    status: AppointmentStatus.CONFIRMADA,
    date: new Date('2026-01-01'),
    startTime: '10:00',
    notes: '',
    createdAt: new Date('2026-01-03T13:00:00Z'),
    updatedAt: new Date('2026-01-03T13:00:00Z')
  },
  {
    id: 5,
    branch: 'Principal',
    officeId: 1,
    patientId: 1,
    doctorId: 1,
    specialty: 'Ortodoncia',
    reason: 'Revisión',
    duration: 30,
    status: AppointmentStatus.CANCELADA,
    date: new Date('2026-01-02'),
    startTime: '13:00',
    notes: 'Cancelado por el paciente',
    createdAt: new Date('2026-01-03T14:00:00Z'),
    updatedAt: new Date('2026-01-08T09:00:00Z')
  },
  {
    id: 6,
    branch: 'Principal',
    officeId: 3,
    patientId: 2,
    doctorId: 2,
    specialty: 'Periodoncia',
    reason: 'Limpieza dental',
    duration: 60,
    status: AppointmentStatus.COMPLETADA, // Cambiado a Completada para usar el nuevo estado
    date: new Date('2026-01-02'),
    startTime: '12:00',
    notes: '',
    createdAt: new Date('2026-01-03T15:00:00Z'),
    updatedAt: new Date('2026-01-03T15:00:00Z')
  }
];

  constructor(private http: HttpClient) {}

  notifyAppointmentCreated(appointment: Appointment) {
    this.appointmentCreatedSource.next(appointment);
  }

  // Obtener todas las citas con filtros
  getAppointments(filters?: AppointmentFilters): Observable<Appointment[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.doctorId) params = params.set('doctorId', filters.doctorId.toString());
      if (filters.patientId) params = params.set('patientId', filters.patientId.toString());
      if (filters.branch) params = params.set('branch', filters.branch);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.specialty) params = params.set('specialty', filters.specialty);

      // Para las fechas, las enviamos como string YYYY-MM-DD
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate.toISOString().split('T')[0]);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate.toISOString().split('T')[0]);
      }
    }

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map(res => res.map(item => this.mapToAppointment(item)))
    );
  }

  // Obtener cita por ID
  getAppointmentById(id: number): Observable<Appointment | undefined> {
    const appointment = this.appointments.find(a => a.id === id);
    return of(appointment).pipe(delay(200));
  }

  // Crear cita
  createAppointment(data: CreateAppointmentDto): Observable<Appointment> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map(res => this.mapToAppointment(res))
    );
  }

  private mapToAppointment(data: any): Appointment {
    return {
      ...data,
      date: new Date(data.date),
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



  // Actualizar cita
  updateAppointment(id: number, data: UpdateAppointmentDto): Observable<Appointment> {
    const index = this.appointments.findIndex(a => a.id === id);

    if (index === -1) {
      throw new Error('Cita no encontrada');
    }

    // 1. Obtenemos la cita actual
    const currentAppointment = this.appointments[index];

    // 2. Aplicamos los cambios del DTO
    // Nota: Al usar spread operator (...) sobre el DTO parcial,
    // solo se sobrescriben los campos que vienen en 'data'
    const updatedAppointment: Appointment = {
      ...currentAppointment,
      ...data,
      // Aseguramos que si viene una fecha en string se convierta a Date
      date: data.date ? new Date(data.date) : currentAppointment.date,
      updatedAt: new Date()
    };

    // 3. Actualizamos nuestra "base de datos" local
    this.appointments[index] = updatedAppointment;

    // 4. Retornamos la cita actualizada con un pequeño delay simulando red
    return of(updatedAppointment).pipe(delay(500));
  }

  // Eliminar cita
  deleteAppointment(id: number | undefined): Observable<void> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
    }
    return of(void 0).pipe(delay(300));
  }

  // Obtener todos los doctores
  getDoctors(): Observable<Doctor[]> {
    return of(this.doctors).pipe(delay(200));
  }

  // Obtener todos los pacientes
  getPatients(): Observable<Patient[]> {
    return of(this.patients).pipe(delay(200));
  }

  getPatientName(id: number): string {
    const patient = this.patients.find(p => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastNamePaternal}` : 'Desconocido';
  }

  getAppointmentsByPatientId(patientId: number): Observable<Appointment[]> {
    const filtered = this.appointments.filter(a => a.patientId === patientId);
    return of(filtered);
  }

  // Obtener paciente por ID
  getPatientById(id: number): Observable<Patient | undefined> {
    const patient = this.patients.find(p => p.id === id);
    return of(patient).pipe(delay(200));
  }

  // Obtener tags disponibles
  getPatientTags(): Observable<PatientTag[]> {
    return of(this.patientTags).pipe(delay(100));
  }

  // Agregar tag a paciente
  addTagToPatient(patientId: number, tagId: number): Observable<Patient> {
    const patient = this.patients.find(p => p.id === patientId);
    const tagExists = availableTags.some(t => t.id === tagId);

    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    if (!tagExists) {
      throw new Error('La etiqueta con ID ' + tagId + ' no existe en el catálogo');
    }

    // En el nuevo modelo, tags es number[]
    if (!patient.tags.includes(tagId)) {
      patient.tags.push(tagId);
    }

    return of(patient).pipe(delay(300));
  }

  // Remover tag de paciente
  removeTagFromPatient(patientId: number, tagId: number): Observable<Patient> {
    const patient = this.patients.find(p => p.id === patientId);

    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    // Filtramos el array de IDs numéricos
    patient.tags = patient.tags.filter(id => id !== tagId);

    return of(patient).pipe(delay(300));
  }
}
