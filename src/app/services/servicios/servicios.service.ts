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
import { Servicio } from '../../models/servicio.model';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private collectionName = 'servicios';

  constructor(private firestore: Firestore) {}

  // Obtiene todos los servicios
  getServicios(): Observable<Servicio[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<Servicio[]>;
  }

  agregarServicio(servicio: Servicio) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, servicio);
  }

  actualizarServicio(id: string, data: Partial<Servicio>) {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(ref, data);
  }

  eliminarServicio(id: string) {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(ref);
  }
}
