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
import { Cliente } from '../../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clienteRef;

  constructor(private firestore: Firestore) {
    this.clienteRef = collection(this.firestore, 'clientes');
  }

  getClientes(): Observable<Cliente[]> {
    return collectionData(this.clienteRef, { idField: 'id' }) as Observable<Cliente[]>;
  }

  agregarCliente(cliente: Cliente) {
    return addDoc(this.clienteRef, cliente);
  }

  actualizarCliente(id: string, data: Partial<Cliente>) {
    const docRef = doc(this.firestore, `clientes/${id}`);
    return updateDoc(docRef, data);
  }

  eliminarCliente(id: string) {
    const docRef = doc(this.firestore, `clientes/${id}`);
    return deleteDoc(docRef);
  }
}