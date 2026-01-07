// services/appointment.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentFilters,
  Patient,
  Doctor,
  PatientTag
} from '../../shared/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

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
      nombre: 'Romeo',
      apellido: 'Prueba',
      telefono: '916623244',
      email: 'romeo@example.com',
      tags: [this.patientTags[0], this.patientTags[1]], // Impuntual y VIP
      nroHistoriaClinica: '0',
      fuenteCaptacion: 'Referido',
      adicional: 'adicional',
      grupoSanguineo: 'O+'
    },
    {
      id: 2,
      nombre: 'Julieta',
      apellido: 'Prueba',
      telefono: '987654321',
      email: 'julieta@example.com',
      tags: [this.patientTags[2]], // Primera vez
      nroHistoriaClinica: '1',
      grupoSanguineo: 'A+'
    },
    {
      id: 3,
      nombre: 'Homero',
      apellido: 'Prueba',
      telefono: '912345678',
      tags: [this.patientTags[3]], // Tratamiento largo
      nroHistoriaClinica: '2',
      grupoSanguineo: 'B+'
    }
  ];

  // Citas de prueba
  private appointments: Appointment[] = [
    {
      id: 1,
      sucursal: 'Principal',
      patientId: 1,
      patientName: 'Romeo Prueba',
      doctorId: 1,
      doctorName: 'Carlos Rodriguez',
      especialidad: 'Ortodoncia',
      motivo: 'Control mensual',
      duracion: 60,
      estado: 'CONFIRMADA',
      fecha: '2026-01-04',
      horaInicial: '09:00',
      horaFinal: '10:00',
      comentarios: 'Paciente requiere ajuste de brackets',
      createdAt: '2026-01-03T10:00:00Z',
      updatedAt: '2026-01-03T10:00:00Z',
      historialCambios: []
    },
    {
      id: 2,
      sucursal: 'Principal',
      patientId: 2,
      patientName: 'Julieta Prueba',
      doctorId: 2,
      doctorName: 'Karen la horrible',
      especialidad: 'Endodoncia',
      motivo: 'Tratamiento de conducto',
      duracion: 90,
      estado: 'CONFIRMADA',
      fecha: '2026-01-03',
      horaInicial: '11:00',
      horaFinal: '10:30',
      createdAt: '2026-01-03T11:00:00Z',
      updatedAt: '2026-01-03T11:00:00Z',
      historialCambios: []
    },
    {
      id: 3,
      sucursal: 'Principal',
      patientId: 3,
      patientName: 'Homero Prueba',
      doctorId: 3,
      doctorName: 'Homero Prueba',
      especialidad: 'Cirugía',
      motivo: 'Extracción de muela',
      duracion: 45,
      estado: 'PENDIENTE',
      fecha: '2026-01-03',
      horaInicial: '11:00',
      horaFinal: '11:45',
      createdAt: '2026-01-03T12:00:00Z',
      updatedAt: '2026-01-03T12:00:00Z',
      historialCambios: []
    },
    {
      id: 4,
      sucursal: 'Principal',
      patientId: 2,
      patientName: 'Julieta Prueba',
      doctorId: 2,
      doctorName: 'Karen la horrible',
      especialidad: 'Endodoncia',
      motivo: 'Seguimiento de conducto',
      duracion: 60,
      estado: 'CONFIRMADA',
      fecha: '2026-01-01',
      horaInicial: '10:00',
      horaFinal: '11:00',
      createdAt: '2026-01-03T13:00:00Z',
      updatedAt: '2026-01-03T13:00:00Z',
      historialCambios: []
    },
    {
      id: 5,
      sucursal: 'Principal',
      patientId: 1,
      patientName: 'Romeo Prueba',
      doctorId: 1,
      doctorName: 'Carlos Rodriguez',
      especialidad: 'Ortodoncia',
      motivo: 'Revisión',
      duracion: 30,
      estado: 'CANCELADA',
      fecha: '2026-01-02',
      horaInicial: '13:00',
      horaFinal: '13:30',
      comentarios: 'Cancelado por el paciente',
      createdAt: '2026-01-03T14:00:00Z',
      updatedAt: '2026-01-05T09:00:00Z',
      historialCambios: [
        {
          id: 1,
          appointmentId: 5,
          userId: 1,
          userName: 'Admin Sistema',
          campo: 'estado',
          valorAnterior: 'CONFIRMADA',
          valorNuevo: 'CANCELADA',
          fecha: '2025-01-05T09:00:00Z'
        }
      ]
    },
    {
      id: 6,
      sucursal: 'Principal',
      patientId: 2,
      patientName: 'Julieta Prueba',
      doctorId: 2,
      doctorName: 'Karen Prueba',
      especialidad: 'Periodoncia',
      motivo: 'Limpieza dental',
      duracion: 60,
      estado: 'CONFIRMADA',
      fecha: '2026-01-02',
      horaInicial: '12:00',
      horaFinal: '13:00',
      createdAt: '2025-01-03T15:00:00Z',
      updatedAt: '2025-01-03T15:00:00Z',
      historialCambios: []
    }
  ];

  constructor() {}

  // Obtener todas las citas con filtros
  getAppointments(filters?: AppointmentFilters): Observable<Appointment[]> {
    let filtered = [...this.appointments];

    if (filters) {
      if (filters.doctorId) {
        filtered = filtered.filter(a => a.doctorId === filters.doctorId);
      }
      if (filters.patientId) {
        filtered = filtered.filter(a => a.patientId === filters.patientId);
      }
      if (filters.sucursal) {
        filtered = filtered.filter(a => a.sucursal === filters.sucursal);
      }
      if (filters.estado) {
        filtered = filtered.filter(a => a.estado === filters.estado);
      }
      if (filters.especialidad) {
        filtered = filtered.filter(a => a.especialidad === filters.especialidad);
      }
      if (filters.fechaInicio && filters.fechaFin) {
        filtered = filtered.filter(a => {
          return a.fecha >= filters.fechaInicio! && a.fecha <= filters.fechaFin!;
        });
      }
    }

    return of(filtered).pipe(delay(300));
  }

  // Obtener cita por ID
  getAppointmentById(id: number): Observable<Appointment | undefined> {
    const appointment = this.appointments.find(a => a.id === id);
    return of(appointment).pipe(delay(200));
  }

  // Crear cita
  createAppointment(data: CreateAppointmentDto): Observable<Appointment> {
    const patient = this.patients.find(p => p.id === data.patientId);
    const doctor = this.doctors.find(d => d.id === data.doctorId);

    if (!patient || !doctor) {
      throw new Error('Paciente o doctor no encontrado');
    }

    // Calcular hora final
    const [hours, minutes] = data.horaInicial.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + data.duracion;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const horaFinal = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    const newAppointment: Appointment = {
      id: this.appointments.length + 1,
      ...data,
      patientName: `${patient.nombre} ${patient.apellido}`,
      doctorName: `${doctor.nombre} ${doctor.apellido}`,
      horaFinal,
      estado: 'PENDIENTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      historialCambios: []
    };

    this.appointments.push(newAppointment);
    return of(newAppointment).pipe(delay(500));
  }

  // Actualizar cita
  updateAppointment(id: number, data: UpdateAppointmentDto, userId: number, userName: string): Observable<Appointment> {
    const index = this.appointments.findIndex(a => a.id === id);

    if (index === -1) {
      throw new Error('Cita no encontrada');
    }

    const oldAppointment = { ...this.appointments[index] };
    const changes: any[] = [];

    // Registrar cambios
    Object.keys(data).forEach(key => {
      const oldValue = (oldAppointment as any)[key];
      const newValue = (data as any)[key];

      if (oldValue !== newValue && newValue !== undefined) {
        changes.push({
          id: oldAppointment.historialCambios.length + changes.length + 1,
          appointmentId: id,
          userId,
          userName,
          campo: key,
          valorAnterior: String(oldValue || ''),
          valorNuevo: String(newValue),
          fecha: new Date().toISOString()
        });
      }
    });

    // Actualizar cita
    this.appointments[index] = {
      ...oldAppointment,
      ...data,
      updatedAt: new Date().toISOString(),
      historialCambios: [...oldAppointment.historialCambios, ...changes]
    };

    // Recalcular hora final si cambió duración u hora inicial
    if (data.duracion || data.horaInicial) {
      const horaInicial = data.horaInicial || this.appointments[index].horaInicial;
      const duracion = data.duracion || this.appointments[index].duracion;
      const [hours, minutes] = horaInicial.split(':').map(Number);
      const endMinutes = hours * 60 + minutes + duracion;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      this.appointments[index].horaFinal = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
    }

    return of(this.appointments[index]).pipe(delay(500));
  }

  // Eliminar cita
  deleteAppointment(id: number): Observable<void> {
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
    const tag = this.patientTags.find(t => t.id === tagId);

    if (!patient || !tag) {
      throw new Error('Paciente o tag no encontrado');
    }

    if (!patient.tags.find(t => t.id === tagId)) {
      patient.tags.push(tag);
    }

    return of(patient).pipe(delay(300));
  }

  // Remover tag de paciente
  removeTagFromPatient(patientId: number, tagId: number): Observable<Patient> {
    const patient = this.patients.find(p => p.id === patientId);

    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    patient.tags = patient.tags.filter(t => t.id !== tagId);
    return of(patient).pipe(delay(300));
  }
}
