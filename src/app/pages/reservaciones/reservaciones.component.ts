import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { Modal } from 'bootstrap';
import {
  ReservacionService,
  Reservacion,
} from '../../services/reservaciones/reservaciones.service';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/clientes/cliente.service';
import { Servicio } from '../../models/servicio.model';
import { ServiciosService } from '../../services/servicios/servicios.service';

@Component({
  selector: 'app-reservaciones',
  standalone: true,
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgIf, NgFor],
})
export class ReservacionesComponent implements OnInit {
  reservaciones: Reservacion[] = [];
  reservacionForm!: FormGroup;
  clientes: Cliente[] = []; // Simulado o traído desde otro servicio
  servicios: Servicio[] = []; // Simulado o traído desde otro servicio
  cargando = true;
  modoEditar = false;
  busquedaCliente = '';

  // FormControl para la selección de cliente (valor = nombre del cliente)
  clienteSeleccionadoControl: FormControl = new FormControl('');

  habitaciones = [
    { id: '1', nombre: 'Sencilla' },
    { id: '2', nombre: 'Doble' },
    { id: '3', nombre: 'Suite' },
  ];

  salones = [
    { id: '1', nombre: 'Magno' },
    { id: '2', nombre: '2/3' },
    { id: '3', nombre: '1/3' },
    { id: '4', nombre: 'Sala' },
    { id: '5', nombre: 'Royal' },
  ];

  promocionesDisponibles = [
    'Habitación cortesía',
    'Degustación',
    'Estacionamiento gratis',
  ];
  promocionesSeleccionadas: string[] = [];

  reservacionEditandoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reservacionService: ReservacionService,
    private clienteService: ClienteService,
    private servicioService: ServiciosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    if (isPlatformBrowser(this.platformId)) {
      this.reservacionService.getReservaciones().subscribe((data) => {
        this.reservaciones = data;
        this.cargando = false;
      });

      this.reservacionForm.valueChanges.subscribe(() => {
        this.calcularTotal();
      });

      this.cargarClientes();
      this.cargarServicios();
    }
  }

  inicializarFormulario() {
    this.reservacionForm = this.fb.group({
      tipoServicio: ['habitacion', Validators.required],
      nombreCliente: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: [''],
      fechaEntrada: [''],
      fechaSalida: [''],
      habitacionId: [''],
      salonId: [''],
      fechaEvento: [''],
      costoPorNoche: [0],
      numeroPersonas: [1],
      total: [0],
      estado: ['Pendiente'],
      formaPago: [''],
    });

    // Suscripción al FormControl de selección de cliente:
    this.clienteSeleccionadoControl.valueChanges.subscribe((nombre: string) => {
      if (nombre) {
        // Busca el cliente cuyo nombre (único) se seleccionó
        const cliente = this.clientes.find((c) => c.nombre === nombre);
        if (cliente) {
          console.log('Cliente seleccionado:', cliente);
          // Actualiza los campos del formulario de reservación con datos del cliente
          this.reservacionForm.patchValue({
            nombreCliente: cliente.nombre,
            telefono: cliente.telefono,
            correo: cliente.correo,
          });
        }
      }
    });
  }

  abrirModalNuevo() {
    this.modoEditar = false;
    this.reservacionEditandoId = null;
    this.promocionesSeleccionadas = [];
    this.reservacionForm.reset();
    this.reservacionForm.patchValue({
      tipoServicio: 'habitacion',
      estado: 'Pendiente',
    });
  }

  abrirModalEditar(reservacion: Reservacion) {
    this.modoEditar = true;
    this.reservacionEditandoId = reservacion.id!;
    this.promocionesSeleccionadas = reservacion.promociones || [];

    this.reservacionForm.patchValue(reservacion);
  }

  guardarReservacion() {
    const data = {
      ...this.reservacionForm.value,
      promociones: this.promocionesSeleccionadas,
    };

    if (this.modoEditar && this.reservacionEditandoId) {
      this.reservacionService
        .actualizarReservacion(this.reservacionEditandoId, data)
        .then(() => {
          this.reservacionForm.reset();
        });
    } else {
      this.reservacionService.agregarReservacion(data).then(() => {
        this.reservacionForm.reset();
      });
    }
  }

  eliminarReservacion(id: string) {
    this.reservacionService.eliminarReservacion(id);
  }

  getNombreHabitacion(id: string) {
    return this.habitaciones.find((h) => h.id === id)?.nombre || '';
  }

  getNombreSalon(id: string) {
    return this.salones.find((s) => s.id === id)?.nombre || '';
  }

  togglePromocion(promo: string, checked: boolean) {
    if (checked) {
      this.promocionesSeleccionadas.push(promo);
    } else {
      this.promocionesSeleccionadas = this.promocionesSeleccionadas.filter(
        (p) => p !== promo
      );
    }
  }

  onPromocionToggle(event: any, promo: string) {
    this.togglePromocion(promo, (event.target as HTMLInputElement).checked);
  }

  esHabitacion(): boolean {
    return this.reservacionForm.get('tipoServicio')?.value === 'habitacion';
  }

  esSalon(): boolean {
    return this.reservacionForm.get('tipoServicio')?.value === 'salon';
  }

  calcularTotal(): void {
    if (this.esHabitacion()) {
      const entrada = new Date(this.reservacionForm.get('fechaEntrada')?.value);
      const salida = new Date(this.reservacionForm.get('fechaSalida')?.value);
      const diffMs = salida.getTime() - entrada.getTime();
      const dias = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);
      const costoPorNoche =
        +this.reservacionForm.get('costoPorNoche')?.value || 0;
      const total = dias * costoPorNoche;
      this.reservacionForm.get('total')?.setValue(total, { emitEvent: false });
    }
  }

  aplicarCliente(): void {
    // Opcional
  }

  cargarClientes(): void {
    this.cargando = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('clientes cargados:', data);
        this.clientes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.cargando = false;
      },
    });
  }

  seleccionarCliente(cliente: any): void {
    this.reservacionForm.patchValue({
      nombreCliente: cliente.nombre,
      telefono: cliente.telefono,
      correo: cliente.correo,
    });
    this.busquedaCliente = '';
  }

  filtroBusquedaClientes: string = '';
  // Getter para obtener los clientes filtrados
  get clientesFiltrados(): Cliente[] {
    if (
      !this.filtroBusquedaClientes ||
      this.filtroBusquedaClientes.trim() === ''
    ) {
      return this.clientes; // Si no hay filtro, se muestran todos
    }
    const busqueda = this.filtroBusquedaClientes.toLowerCase().trim();
    return this.clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(busqueda) ||
        (cliente.telefono && cliente.telefono.toLowerCase().includes(busqueda))
    );
  }

  cargarServicios(): void {
    this.cargando = true;
    this.servicioService.getServicios().subscribe({
      next: (data) => {
        console.log('servicios cargados:', data);
        this.servicios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.cargando = false;
      },
    });
  }

  // Getter para obtener los tipos de servicio únicos del array de servicios
  get tiposServiciosUnicos(): string[] {
    const tipos = this.servicios.map((servicio) => servicio.tipoServicio);
    return Array.from(new Set(tipos));
  }

  get reservacionesFiltradas(): Reservacion[] {
    const filtro = this.filtroBusqueda?.toLowerCase() || '';
    return this.reservaciones.filter(
      (r) =>
        r.nombreCliente.toLowerCase().includes(filtro) ||
        r.tipoServicio.toLowerCase().includes(filtro)
    );
  }

  // Getter que filtra los servicios según el tipo seleccionado
  get opcionesServicio(): Servicio[] {
    const tipo = this.reservacionForm.get('tipoServicio')?.value;
    if (tipo) {
      return this.servicios.filter(
        (s) => s.tipoServicio.toLowerCase() === tipo.toLowerCase()
      );
    }
    return [];
  }

  // Método para actualizar automáticamente los campos "costoPorNoche" y "numeroPersonas"
  // al seleccionar un servicio (valor = nombre del servicio)
  seleccionarServicio(servicioNombre: string): void {
    // Busca en la lista filtrada el servicio cuyo nombre coincide
    const servicioSeleccionado = this.opcionesServicio.find(
      (s) => s.nombre === servicioNombre
    );
    if (servicioSeleccionado) {
      // Utiliza el precio del servicio para "costoPorNoche"
      const costoPorNoche = servicioSeleccionado.precio;
      // Usamos la capacidad (que puede ser string o number) para "numeroPersonas"
      let numeroPersonas = 1;
      if (servicioSeleccionado.capacidad) {
        numeroPersonas =
          typeof servicioSeleccionado.capacidad === 'number'
            ? servicioSeleccionado.capacidad
            : parseInt(servicioSeleccionado.capacidad, 10) || 1;
      }
      // Actualiza el formulario con estos valores
      this.reservacionForm.patchValue({
        costoPorNoche: costoPorNoche,
        numeroPersonas: numeroPersonas,
      });
    }
  }

  filtroBusqueda = '';
}
