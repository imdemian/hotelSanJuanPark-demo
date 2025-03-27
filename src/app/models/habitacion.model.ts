export interface Habitacion {
  id?: string; // Identificador único asignado por Firestore (opcional)
  tipoHabitacion: 'sencilla' | 'doble' | 'suite' | string; // Tipo de habitación (sencilla, doble, suite, etc.)
  costoPorNoche: number; // Costo de la habitación por noche
  estado: 'disponible' | 'ocupada' | 'reservada' | string; // Estado actual de la habitación
  detalles: string; // Descripción o características adicionales de la habitación
  imagenURL?: string; // URL opcional para mostrar una imagen de la habitación
}
