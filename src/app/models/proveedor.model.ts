export interface Proveedor {
  id?: string; // Identificador único asignado por Firestore (opcional)
  nombre: string; // Nombre del proveedor o empresa
  tipoServicio: 'alimentos' | 'bebidas' | 'mantenimiento' | 'limpieza' | string; // Tipo de servicio que ofrece, con opciones comunes o personalizadas

  telefono: string; // Teléfono de contacto
  correo?: string; // Correo electrónico (opcional)

  direccion?: string; // Dirección del proveedor (opcional)
  observaciones?: string; // Notas o comentarios adicionales (opcional)
  activo?: boolean; // Indica si el proveedor está activo o no (opcional)
}
