export class Cliente {
  id!: string;
  nombre!: string;
  apellidoPaterno!: string;
  apellidoMaterno!: string;
  edad!: number;
  sexo!: 'M' | 'F' | 'Otro';
  correo!: string;
  telefono!: string;
  ciudadOrigen!: string;
  frecuenciaCompra!: number;
  fechasEspeciales?: EspecialEvento[];
}

export interface EspecialEvento {
  evento: string; // Nombre del evento (por ejemplo, "cumpleaños", "aniversario")
  fecha: Date; // Fecha en la que ocurre el evento
}
