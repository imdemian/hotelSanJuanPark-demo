import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdenCompra } from '../../models/orden.model';
import { OrdenCompraService } from '../../services/orden/orden-compra.service';
import { Proveedor } from '../../services/proveedor/proveedor.service';
import { ProveedorService } from '../../services/proveedor/proveedor.service';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class OrdenesComponent implements OnInit {
  ordenes: OrdenCompra[] = [];
  proveedores: Proveedor[] = [];
  
  ordenForm!: FormGroup;
  cargando: boolean = true;
  
  modoEditar: boolean = false;
  ordenEditandoId: string | null = null;
  
  // Filtro por estado (pendiente, aprobada, rechazada)
  filtroEstado: string = '';
  
  // Variables para manejar modales de confirmación
  ordenSeleccionada: OrdenCompra | null = null; // Para rechazo o eliminación
  ordenEliminar: OrdenCompra | null = null; // Orden a eliminar

  constructor(
    private fb: FormBuilder,
    private ordenService: OrdenCompraService,
    private proveedorService: ProveedorService
  ) { }

  ngOnInit(): void {
    // Inicializa el formulario de órdenes
    this.ordenForm = this.fb.group({
      proveedorId: ['', Validators.required],
      productos: ['', Validators.required],
      fechaCreacion: [new Date(), Validators.required],
      estado: ['pendiente', Validators.required],
      comentario: ['']
    });

    // Cargar órdenes de compra
    this.ordenService.getOrdenes().subscribe(data => {
      this.ordenes = data;
      this.cargando = false;
    });
    
    // Cargar proveedores para el selector
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
    });
  }

  // Abre el modal para crear una nueva orden
  abrirModalNuevo(): void {
    this.modoEditar = false;
    this.ordenEditandoId = null;
    this.ordenForm.reset();
    this.ordenForm.patchValue({
      fechaCreacion: new Date(),
      estado: 'pendiente'
    });
  }

  // Prepara el formulario para editar la orden seleccionada
  abrirModalEditar(orden: OrdenCompra): void {
    this.modoEditar = true;
    this.ordenEditandoId = orden.id || null;
    this.ordenForm.patchValue({
      proveedorId: orden.proveedorId,
      productos: orden.productos,
      fechaCreacion: orden.fechaCreacion,
      estado: orden.estado,
      comentario: orden.comentario || ''
    });
  }

  // Guarda (agrega o actualiza) la orden de compra
  guardarOrden(): void {
    if (this.ordenForm.invalid) return;
    
    const data = this.ordenForm.value;
    if (!this.modoEditar) data.estado = 'pendiente';

    if (this.modoEditar && this.ordenEditandoId) {
      this.ordenService.actualizarOrden(this.ordenEditandoId, data)
        .then(() => this.ordenForm.reset())
        .catch(error => console.error('Error actualizando orden: ', error));
    } else {
      this.ordenService.agregarOrden(data)
        .then(() => this.ordenForm.reset())
        .catch(error => console.error('Error agregando orden: ', error));
    }
  }

  // Aprobación de la orden: actualiza el estado a "aprobada"
  aprobarOrden(orden: OrdenCompra): void {
    if (orden.id) {
      this.ordenService.actualizarOrden(orden.id, { estado: 'aprobada' })
        .then(() => console.log('Orden aprobada'))
        .catch(error => console.error('Error aprobando orden: ', error));
    }
  }

  // Rechaza la orden con un comentario (para ello se abre modal de rechazo)
  rechazarOrden(orden: OrdenCompra, comentario: string): void {
    if (orden.id) {
      this.ordenService.actualizarOrden(orden.id, { estado: 'rechazada', comentario })
        .then(() => console.log('Orden rechazada'))
        .catch(error => console.error('Error rechazando orden: ', error));
    }
  }

  // Abre el modal para confirmación de rechazo, asignando la orden actual
  abrirModalRechazo(orden: OrdenCompra): void {
    this.ordenSeleccionada = orden;
  }

  // Parte relevante del componente OrdenesComponent
abrirModalEliminar(orden: OrdenCompra): void {
  this.ordenEliminar = orden;
}
  
confirmarEliminarOrden(): void {
  if (this.ordenEliminar && this.ordenEliminar.id) {
    this.ordenService.eliminarOrden(this.ordenEliminar.id)
      .then(() => {
        console.log('Orden eliminada correctamente');
        this.ordenEliminar = null;
      })
      .catch(error => console.error('Error eliminando orden: ', error));
  }
}

  // Getter para filtrar la lista de órdenes por estado
  get ordenesFiltradas(): OrdenCompra[] {
    if (!this.filtroEstado.trim()) return this.ordenes;
    return this.ordenes.filter(o =>
      o.estado.toLowerCase() === this.filtroEstado.trim().toLowerCase()
    );
  }

  // Devuelve el nombre del proveedor dado su ID, consultando el arreglo de proveedores
  getNombreProveedor(proveedorId: string | undefined): string {
    if (!proveedorId) return 'Sin proveedor';
    const prov = this.proveedores.find(p => p.id === proveedorId);
    return prov ? prov.nombre : proveedorId;
  }
    
}
