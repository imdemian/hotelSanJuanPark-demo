export type TipoServicio = 'habitacion' | 'evento' | 'banquete';

export interface Servicio {
  id?: string;
  tipo: 'habitacion' | 'evento' | string;
  capacidadPersonas?: number;  // Opcional para habitación
  capacidadMaxima?: number;    // Opcional para evento
  incluyeDesayuno?: boolean;  // Opcional
  precioConDesayuno?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  capacidad?: number;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
}

export interface ServicioHabitacion extends Servicio {
  tipo: 'habitacion';
  tipoHabitacion: 'sencilla' | 'doble' | 'suite';
  capacidadPersonas: number;
  incluyeDesayuno: boolean;
  precioConDesayuno?: number;
}

export interface ServicioEvento extends Servicio {
  tipo: 'evento';
  tipoSalon: 'magno' | '2/3' | '1/3' | 'sala' | 'royal';
  capacidadMaxima: number;
  equipoIncluido?: string[];
}

export interface ServicioBanquete extends Servicio {
  tipo: 'banquete';
  tipoBanquete: string;
  precioUnitario: number;
}

export interface Promocion {
  id?: string;
  nombre: string;
  descripcion: string;
  tipoEvento: 'XV Años' | 'Boda' | 'Bautizo' | 'Cumpleaños' | string;
  beneficios: string[];
  activo: boolean;
}

export interface ReservaServicio {
  id?: string;
  idReserva?: string;
  idServicio: string;
  tipoServicio: TipoServicio;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  promocionesAplicadas?: Promocion[];
  habitacionCortesia?: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
}
