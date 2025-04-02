// src/app/services/proveedor.service.ts
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

export interface Proveedor {
  id?: string;
  nombre: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private proveedorRef;

  constructor(private firestore: Firestore) {
    this.proveedorRef = collection(this.firestore, 'proveedores');
  }

  getProveedores(): Observable<Proveedor[]> {
    return collectionData(this.proveedorRef, { idField: 'id' }) as Observable<
      Proveedor[]
    >;
  }

  agregarProveedor(proveedor: Proveedor) {
    return addDoc(this.proveedorRef, proveedor);
  }

  eliminarProveedor(id: string) {
    const docRef = doc(this.firestore, `proveedores/${id}`);
    return deleteDoc(docRef);
  }

  actualizarProveedor(id: string, data: Partial<Proveedor>) {
    const docRef = doc(this.firestore, `proveedores/${id}`);
    return updateDoc(docRef, data);
  }
}
