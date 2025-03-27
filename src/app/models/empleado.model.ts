export interface Empleado {
  id?: string; // Identificador único asignado por Firestore (opcional)
  nombre: string; // Nombre completo del empleado
  apellidoPaterno: string; // Apellido paterno del empleado
  apellidoMaterno: string; // Apellido materno del empleado
  edad: number; // Edad del empleado
  sexo: 'M' | 'F' | 'Otro'; // Sexo del empleado, con opciones predefinidas
  correo: string; // Correo electrónico del empleado
  telefono: string; // Número telefónico de contacto
  puesto: 'dueño' | 'gerente' | 'recepcionista' | string; // Rol o puesto del empleado
  fechaIngreso: Date; // Fecha de ingreso o contratación
  activo?: boolean; // Bandera para indicar si el empleado está activo (opcional)
}
