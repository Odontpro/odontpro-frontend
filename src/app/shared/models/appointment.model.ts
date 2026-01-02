// models/appointment.model.ts

export interface Appointment {
  id: number;
  sucursal: string;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  especialidad: string;
  motivo: string;
  duracion: number; // en minutos
  estado: AppointmentStatus;
  fecha: string; // ISO date string
  horaInicial: string; // HH:mm format
  horaFinal: string; // calculado automáticamente
  opcional?: string;
  comentarios?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
  historialCambios: AppointmentChange[];
}

export type AppointmentStatus =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'EN_CURSO'
  | 'COMPLETADA'
  | 'CANCELADA'
  | 'NO_ASISTIO';

export interface AppointmentChange {
  id: number;
  appointmentId: number;
  userId: number;
  userName: string;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  fecha: string;
}

export interface PatientTag {
  id: number;
  nombre: string;
  color: string;
  backgroundColor: string;
}

export interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  foto?: string;
  tags: PatientTag[];
  nroHistoriaClinica: string;
  grupoSanguineo?: string;
  fuenteCaptacion?: string;
  adicional?: string;
  lineaNegocio?: string;
}

export interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  color: string; // Color para identificar en el calendario
  especialidades: string[];
}

// DTO para crear cita
export interface CreateAppointmentDto {
  sucursal: string;
  patientId: number;
  doctorId: number;
  especialidad: string;
  motivo: string;
  duracion: number;
  fecha: string;
  horaInicial: string;
  opcional?: string;
  comentarios?: string;
  notas?: string;
}

// DTO para actualizar cita
export interface UpdateAppointmentDto {
  sucursal?: string;
  patientId?: number;
  doctorId?: number;
  especialidad?: string;
  motivo?: string;
  duracion?: number;
  estado?: AppointmentStatus;
  fecha?: string;
  horaInicial?: string;
  opcional?: string;
  comentarios?: string;
  notas?: string;
}

// Filtros para el calendario
export interface AppointmentFilters {
  doctorId?: number;
  patientId?: number;
  sucursal?: string;
  estado?: AppointmentStatus;
  fechaInicio?: string;
  fechaFin?: string;
  especialidad?: string;
}
