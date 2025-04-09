// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


export interface Usuario {
  id?: string; // Identificador único asignado por Firestore (opcional)
  usuario: string; // Nombre completo del usuario
  email: string; // Correo electrónico del usuario
  rol: 'dueño' | 'administradora' | 'recepcionista' | 'gerente' | string;
  activo: boolean; // Estado activo del usuario
  fechaRegistro: Date; // Fecha de registro en el sistema
  idEmpleado?: string; // Referencia al empleado asociado (si aplica)
}
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarioRef;

  constructor(private firestore: Firestore) {
    // 'usuarios' es el nombre de la colección en Firestore
    this.usuarioRef = collection(this.firestore, 'usuarios');
  }

  // Obtiene la lista de usuarios y añade el id de cada documento
  getUsuarios(): Observable<Usuario[]> {
    return collectionData(this.usuarioRef, { idField: 'id' }) as Observable<Usuario[]>;
  }

  // Agrega un nuevo usuario a la colección
  agregarUsuario(usuario: Usuario) {
    return addDoc(this.usuarioRef, usuario);
  }

  // Elimina un usuario dado su id
  eliminarUsuario(id: string) {
    const docRef = doc(this.firestore, `usuarios/${id}`);
    return deleteDoc(docRef);
  }

  // Actualiza la información de un usuario específico
  actualizarUsuario(id: string, data: Partial<Usuario>) {
    const docRef = doc(this.firestore, `usuarios/${id}`);
    return updateDoc(docRef, data);
  }
}
