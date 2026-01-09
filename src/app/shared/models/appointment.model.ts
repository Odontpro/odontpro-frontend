// models/appointment.model.ts
import {User} from './user.model';
import {Patient} from './patient.model';

export interface Appointment {
  id?: number;

  branch: string;       // 'Principal' por defecto
  officeId?: number;    // ID del consultorio/box

  // Objetos completos que devuelve el backend
  patient?: Patient;
  doctor?: User;

  patientId: number;    // ID del paciente
  doctorId: number;     // ID del usuario (Doctor/Admin)

  specialty: string;    // Especialidad (ej: 'Ortodoncia')
  reason: string;       // Motivo de la consulta
  duration: number;     // Duración en minutos (ej: 30, 45, 60)
  status: AppointmentStatus;

  date: Date;           // Fecha de la cita (YYYY-MM-DD)
  startTime: string;    // Hora inicial en formato 24h (ej: '14:30')

  notes?: string;       // Nota de la cita (Long text)

  createdAt?: Date;
  updatedAt?: Date;
}

export enum AppointmentStatus {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  EN_CURSO = 'EN_CURSO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  NO_ASISTIO = 'NO_ASISTIO'
}

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'PENDIENTE' as AppointmentStatus, label: 'Pendiente' },
  { value: 'CONFIRMADA' as AppointmentStatus, label: 'Confirmada' },
  { value: 'EN_CURSO' as AppointmentStatus, label: 'En curso' },
  { value: 'COMPLETADA' as AppointmentStatus, label: 'Completada' },
  { value: 'CANCELADA' as AppointmentStatus, label: 'Cancelada' },
  { value: 'NO_ASISTIO' as AppointmentStatus, label: 'No Asistió' }
];

export interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  color: string; // Color para identificar en el calendario
  especialidades: string[];
}

// DTO para crear cita
export interface CreateAppointmentDto {
  branch: string;           // Por defecto 'Principal'
  officeId?: number;        // ID del consultorio (opcional)

  patientId: number;        // ID del paciente seleccionado
  doctorId: number;         // ID del doctor asignado

  specialty: string;        // Ej: 'Ortodoncia'
  reason: string;           // Ej: 'Control mensual'
  duration: number;         // Minutos (ej: 30)
  status: AppointmentStatus; // 'PENDIENTE', etc.

  date: string;             // Fecha en formato ISO string '2026-01-08'
  startTime: string;        // Hora formato 24h '16:00'

  notes?: string;           // Nota de la cita
}

// DTO para actualizar cita
export interface UpdateAppointmentDto {
  branch: string;           // Por defecto 'Principal'
  officeId?: number;        // ID del consultorio (opcional)

  patientId: number;        // ID del paciente seleccionado
  doctorId: number;         // ID del doctor asignado

  specialty: string;        // Ej: 'Ortodoncia'
  reason: string;           // Ej: 'Control mensual'
  duration: number;         // Minutos (ej: 30)
  status: AppointmentStatus; // 'PENDIENTE', etc.

  date: string;             // Fecha en formato ISO string '2026-01-08'
  startTime: string;        // Hora formato 24h '16:00'

  notes?: string;           // Nota de la cita
}

// Filtros para el calendario
export interface AppointmentFilters {
  doctorId?: number;
  patientId?: number;
  branch?: string;           // Antes sucursal
  status?: AppointmentStatus; // Antes estado
  specialty?: string;        // Antes especialidad
  startDate?: Date;          // Antes fechaInicio
  endDate?: Date;            // Antes fechaFin
}

export interface DurationOption {
  label: string; // Lo que ve el usuario: "1h 30"
  value: number; // Lo que va al backend: 90
}
