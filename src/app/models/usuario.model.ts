export interface Usuario {
  id?: string; // Identificador único asignado por Firestore (opcional)
  usuario: string; // Nombre completo del usuario
  email: string; // Correo electrónico del usuario
  rol: 'dueño' | 'administradora' | 'recepcionista' | 'gerente' | string;
  activo: boolean; // Estado activo del usuario
  fechaRegistro: Date; // Fecha de registro en el sistema
  idEmpleado?: string; // Referencia al empleado asociado (si aplica)
}
