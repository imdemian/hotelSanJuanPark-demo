// En tu cliente.model.ts
export interface Cliente {
  id?: string;
  nombre: string;
  edad: number;
  sexo: string;
  correo: string;
  telefono: string;
  ciudad: string;
  preferenciaPago: string;
  tipoServicio: string;
  costoReserva: number;
  habitacion?: string;
  numPersonas: number;
  fechaReserva: Date | any;
  fechaEstancia: Date | any;
  frecuenciaCompra: number;
  fechasEspeciales?: string[];
  membresia?: 'VIP' | 'Premier' | 'Tradicional' | 'No Aplica';
  totalGastado?: number; // Nuevo campo para tracking
}