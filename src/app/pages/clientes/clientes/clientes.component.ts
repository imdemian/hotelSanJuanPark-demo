import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ClienteService } from '../../../services/clientes/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { CommonModule, NgIf, NgFor, isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm!: FormGroup;
  cargando = true;
  guardando = false;
  modoEditar = false;
  clienteEditandoId: string | null = null;

  // Filtros
  filtroBusqueda: string = '';
  filtroEdad: number | null = null;
  filtroCiudad: string = '';
  filtroTipoServicio: string = '';
  mostrarFiltrosAvanzados: boolean = false;
  modalInstance: any = null;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    if (isPlatformBrowser(this.platformId)) {
      this.cargarClientes();
    }
  }

  inicializarFormulario(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      sexo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      ciudad: ['', Validators.required],
      preferenciaPago: ['', Validators.required],
      tipoServicio: ['', Validators.required],
      costoReserva: [''],
      habitacion: [''],
      numPersonas: ['', [Validators.required, Validators.min(1)]],
      fechaReserva: ['', Validators.required],
      fechaEstancia: ['', Validators.required],
      frecuenciaCompra: ['', [Validators.required, Validators.min(1)]],
      fechasEspeciales: [''],
    });
  }

  cargarClientes(): void {
    this.cargando = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.cargando = false;
      },
    });
  }

  abrirModalNuevo(): void {
    this.modoEditar = false;
    this.clienteEditandoId = null;
    this.clienteForm.reset();
  }

  abrirModalEditar(cliente: Cliente): void {
    this.modoEditar = true;
    this.clienteEditandoId = cliente.id || null;

    this.clienteForm.setValue({
      nombre: cliente.nombre || '',
      edad: cliente.edad || '',
      sexo: cliente.sexo || '',
      correo: cliente.correo || '',
      telefono: cliente.telefono || '',
      ciudad: cliente.ciudad || '',
      preferenciaPago: cliente.preferenciaPago || '',
      tipoServicio: cliente.tipoServicio || '',
      costoReserva: cliente.costoReserva || '',
      habitacion: cliente.habitacion || '',
      numPersonas: cliente.numPersonas || 1,
      fechaReserva: this.formatDateForInput(cliente.fechaReserva),
      fechaEstancia: this.formatDateForInput(cliente.fechaEstancia),
      frecuenciaCompra: cliente.frecuenciaCompra || 1,
      fechasEspeciales: cliente.fechasEspeciales || '',
    });
  }

  inicializarModal(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      const modalEl = document.getElementById('modalAgregarCliente');
      if (modalEl) {
        if (this.modalInstance) {
          this.modalInstance.hide();
        }

        this.modalInstance = new bootstrap.Modal(modalEl, {
          backdrop: true,
          keyboard: true,
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
          this.clienteForm.reset();
          this.modoEditar = false;
          this.clienteEditandoId = null;
          this.clientes = [...this.clientes];
        });

        this.modalInstance.show();
      }
    }, 100);
  }

  guardarCliente(): void {
    if (this.clienteForm.invalid || this.guardando) return;

    this.guardando = true;

    const clienteData = {
      ...this.clienteForm.value,
      fechaReserva: new Date(this.clienteForm.value.fechaReserva),
      fechaEstancia: new Date(this.clienteForm.value.fechaEstancia),
    };

    if (this.modoEditar && this.clienteEditandoId) {
      // Actualizar cliente existente
      this.clienteService
        .actualizarCliente(this.clienteEditandoId, clienteData)
        .then(() => {
          this.finalizarGuardado();
        })
        .catch((error) => {
          console.error('Error al actualizar cliente:', error);
          this.guardando = false;
        });
    } else {
      // Agregar nuevo cliente (asegurándose que no es una edición)
      this.clienteService
        .agregarCliente(clienteData)
        .then(() => {
          this.finalizarGuardado();
        })
        .catch((error) => {
          console.error('Error al agregar cliente:', error);
          this.guardando = false;
        });
    }
  }

  finalizarGuardado(): void {
    this.cargarClientes();
    this.clienteForm.reset();
    this.modoEditar = false;
    this.clienteEditandoId = null;
    this.guardando = false;

    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  eliminarCliente(id: string): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clienteService
        .eliminarCliente(id)
        .then(() => {
          this.cargarClientes();
        })
        .catch((error) => console.error('Error al eliminar:', error));
    }
  }

  // Filtros
  toggleFiltrosAvanzados(): void {
    this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados;
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroEdad = null;
    this.filtroCiudad = '';
    this.filtroTipoServicio = '';
  }

  get clientesFiltrados(): Cliente[] {
    return this.clientes.filter(
      (cliente) =>
        (!this.filtroBusqueda ||
          `${cliente.nombre} ${cliente.correo} ${cliente.telefono}`
            .toLowerCase()
            .includes(this.filtroBusqueda.toLowerCase())) &&
        (!this.filtroEdad || cliente.edad === this.filtroEdad) &&
        (!this.filtroCiudad ||
          cliente.ciudad
            .toLowerCase()
            .includes(this.filtroCiudad.toLowerCase())) &&
        (!this.filtroTipoServicio ||
          cliente.tipoServicio
            .toLowerCase()
            .includes(this.filtroTipoServicio.toLowerCase()))
    );
  }

  private formatDateForInput(date: any): string {
    if (!date) return '';

    try {
      // Si es un Timestamp de Firestore (con método toDate)
      if (date && typeof date.toDate === 'function') {
        const jsDate = date.toDate();
        return this.convertDateToInputFormat(jsDate);
      }

      // Si ya es un objeto Date
      if (date instanceof Date) {
        return this.convertDateToInputFormat(date);
      }

      // Si es un string de fecha
      if (typeof date === 'string') {
        const jsDate = new Date(date);
        if (!isNaN(jsDate.getTime())) {
          return this.convertDateToInputFormat(jsDate);
        }
      }

      return '';
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }

  private convertDateToInputFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
