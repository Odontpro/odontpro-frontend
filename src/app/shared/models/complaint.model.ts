export interface Complaint {
  fecha: string; // ISO string
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: 'dni' | 'pasaporte' | 'carnet_extranjeria';
  numeroDocumento: string;
  email: string;
  telefonoFijo?: string;
  telefonoCelular: string;
  direccion: string;
  distrito: string;
  departamento: string;
  detalleReclamo: string;
  autorizacionNotificacion: boolean;
  
}
