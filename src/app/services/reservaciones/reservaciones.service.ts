// reservacion.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Reservacion {
  id?: string;
  tipoServicio: 'habitacion' | 'salon';
  estado: 'Pendiente' | 'Parcial' | 'Confirmada' | 'Pagado' | 'Cancelada';

  nombreCliente: string;
  edad?: number;
  sexo?: 'Masculino' | 'Femenino' | 'Otro';
  correo: string;
  telefono: string;
  ciudadOrigen?: string;
  preferenciaPago?: 'Tarjeta' | 'Transferencia';
  numeroPersonas?: number;
  fechaRegistro?: string;
  frecuenciaCompra?: 'Primera vez' | 'Frecuente' | 'Esporádico';
  fechaEspecial?: {
    tipo: 'Cumpleaños' | 'Aniversario' | 'Trabajo' | 'Otro';
    fecha: string;
  };

  fechaEntrada?: string;
  fechaSalida?: string;
  fechaEvento?: string;

  habitacionId?: string;
  salonId?: string;

  total: number;
  pagoAnticipo?: number;
  pagoPendiente?: number;

  datosTarjeta?: {
    titular: string;
    numero: string;
    vencimiento: string;
  };

  comprobanteTransferencia?: string;
  promociones?: string[];
  ultimaActualizacion?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservacionService {
  constructor(private firestore: Firestore) {}

  getReservaciones(): Observable<Reservacion[]> {
    const ref = collection(this.firestore, 'reservaciones');
    return collectionData(ref, { idField: 'id' }) as Observable<Reservacion[]>;
  }

  agregarReservacion(r: Reservacion) {
    const ref = collection(this.firestore, 'reservaciones');
    return addDoc(ref, r);
  }

  actualizarReservacion(id: string, data: Partial<Reservacion>) {
    const ref = doc(this.firestore, `reservaciones/${id}`);
    return updateDoc(ref, data);
  }

  eliminarReservacion(id: string) {
    const ref = doc(this.firestore, `reservaciones/${id}`);
    return deleteDoc(ref);
  }
}
