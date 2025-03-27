export interface Reservacion {
  id?: string; // Identificador único asignado por Firestore (opcional)
  idCliente: string; // Referencia o ID del cliente que realiza la reserva
  servicio: string; // Tipo de servicio reservado (habitación, paquete, etc.)
  idHabitacion: string; // Referencia o ID de la habitación reservada
  fechaReserva: Date; // Fecha en la que se realiza la reserva
  estancia: {
    fechaInicio: Date;
    fechaFin: Date;
  }; // Fecha de inicio de la estancia
  duracionEstancia: number; // Cantidad de días de la estancia
  costoReserva: number; // Precio final aplicado para la reserva (puede ser ajustado por personal autorizado)
  numeroPersonas: number; // Número de personas que ocuparán la habitación
  pago: {
    preferencia: 'efectivo' | 'tarjeta' | 'transferencia' | string;
    saldoFavor: number;
    saldoPendiente: number;
  }; // Método de pago (efectivo, tarjeta, transferencia, etc.)
  motivoReserva?: string; // Opcional, motivo o comentario adicional sobre la reserva
  status:
    | 'pendiente'
    | 'confirmada'
    | 'cancelada'
    | 'checkIn'
    | 'checkOut'
    | string; // Estado actual de la reserva
}

export interface fechasEstancia {
  fechaInicio: Date;
  fechaFin: Date;
}
