import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OrdenCompra } from '../../models/orden.model';

@Injectable({
  providedIn: 'root',
})
export class OrdenCompraService {
  private ordenesRef;

  constructor(private firestore: Firestore) {
    // 'ordenesCompra' es el nombre de la colección en Firestore
    this.ordenesRef = collection(this.firestore, 'ordenesCompra');
  }

  // Obtiene las órdenes de compra incluyendo el campo id
  getOrdenes(): Observable<OrdenCompra[]> {
    return collectionData(this.ordenesRef, { idField: 'id' }) as Observable<OrdenCompra[]>;
  }

  // Agrega una nueva orden de compra
  agregarOrden(orden: OrdenCompra) {
    return addDoc(this.ordenesRef, orden);
  }

  // Actualiza una orden existente
  actualizarOrden(id: string, data: Partial<OrdenCompra>) {
    const docRef = doc(this.firestore, `ordenesCompra/${id}`);
    return updateDoc(docRef, data);
  }

  // Elimina una orden
  eliminarOrden(id: string) {
    const docRef = doc(this.firestore, `ordenesCompra/${id}`);
    return deleteDoc(docRef);
  }
}
