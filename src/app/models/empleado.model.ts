export interface Empleado {
  id?: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  edad: number
  sexo: string
  correo: string
  telefono: string
  puesto: string
  fechaIngreso: any // Puede ser Date, string, o un objeto Timestamp de Firestore
  activo: boolean
}

