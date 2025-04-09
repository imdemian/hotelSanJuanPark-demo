export interface Servicio {
  id?: string;
  tipoServicio: 'habitacion' | 'salon' | 'banquete';
  nombre: string;
  descripcion?: string;
  capacidad?: string | number;
  precio: number;
  // Por ejemplo, para habitaciones podría haber un precio adicional (como desayuno)
  precioAdicional?: number;
  ultimaActualizacion?: string;
}
