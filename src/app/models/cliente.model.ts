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
  costoReserva?: number;
  habitacion?: string;
  numPersonas: number;
  fechaReserva: string;
  fechaEstancia: string;
  frecuenciaCompra: number;
  fechasEspeciales?: string;
}