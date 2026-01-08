export type DocumentType = 'DNI' | 'PASAPORTE' | 'RUC' | 'CARNET_EXTRANJERIA' | 'OTROS';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface PatientTag {
  id: number;
  nombre: string;
  color: string;
  backgroundColor: string;
}

export const availableTags: PatientTag[] = [
  { id: 1, nombre: 'Nuevo', color: '#2e7d32', backgroundColor: '#e8f5e9' },
  { id: 2, nombre: 'VIP', color: '#6a1b9a', backgroundColor: '#f3e5f5' },
  { id: 3, nombre: 'Impuntual', color: '#d32f2f', backgroundColor: '#ffebee' },
  { id: 4, nombre: 'Fidelizado', color: '#0288d1', backgroundColor: '#e1f5fe' },
  { id: 5, nombre: 'Favorito', color: '#f57c00', backgroundColor: '#fff3e0' }
];

export interface Patient {
  id?: number;

  // Identificación
  documentType: DocumentType;
  documentNumber: string;
  hasNoDocument: boolean; // Para el checkbox "No tiene"

  // Información Personal
  firstName: string;
  lastNamePaternal: string; // Apellido Paterno
  lastNameMaternal?: string; // Apellido Materno (opcional)
  birthDate?: Date;
  gender?: Gender;
  bloodGroup?: BloodGroup;

  // Contacto
  phonePrefix: string; // Ej: '+51'
  phoneNumber: string;
  hasNoPhone: boolean; // Para el checkbox "No tiene"
  email?: string;

  //etiquetas
  tags: number[]; // Etiquetas (como "Impuntual")

  // Relaciones y Notas
  hasGuardian: boolean; // Tiene un apoderado
  generalNote?: string; // "Nota general" que vimos en el diseño

  // Auditoría básica
  createdAt: Date;
  updatedAt: Date;
}
