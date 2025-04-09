import { ArrayOptions } from "stream";

export interface OrdenCompra {
    id?: string;
    proveedorId: string;
    productos: ArrayOptions; // o un array si es más complejo
    fechaCreacion: Date;
    estado: 'pendiente' | 'aprobada' | 'rechazada';
    comentario?: string;
  }
  