import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Empleado } from '../../models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private empleadoRef;

  constructor(private firestore: Firestore) {
    this.empleadoRef = collection(this.firestore, 'empleados');
  }

  getEmpleados(): Observable<Empleado[]> {
    return collectionData(this.empleadoRef, { idField: 'id' }) as Observable<Empleado[]>;
  }

  agregarEmpleado(empleado: Empleado) {
    return addDoc(this.empleadoRef, empleado);
  }

  actualizarEmpleado(id: string, data: Partial<Empleado>) {
    const docRef = doc(this.firestore, `empleados/${id}`);
    return updateDoc(docRef, data);
  }

  eliminarEmpleado(id: string) {
    const docRef = doc(this.firestore, `empleados/${id}`);
    return deleteDoc(docRef);
  }
}