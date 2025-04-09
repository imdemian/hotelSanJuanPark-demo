import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { Modal } from 'bootstrap';
import {
  ReservacionService,
  Reservacion,
} from '../../services/reservaciones/reservaciones.service';

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
  cargando = true;
  modoEditar = false;
  busquedaCliente = '';
  clientes: any[] = []; // Simulado o traído desde otro servicio

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.reservacionService.getReservaciones().subscribe((data) => {
      this.reservaciones = data;
      this.cargando = false;
    });

    this.reservacionForm.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
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

  seleccionarCliente(cliente: any): void {
    this.reservacionForm.patchValue({
      nombreCliente: cliente.nombre,
      telefono: cliente.telefono,
      correo: cliente.correo,
    });
    this.busquedaCliente = '';
  }

  get reservacionesFiltradas(): Reservacion[] {
    const filtro = this.filtroBusqueda?.toLowerCase() || '';
    return this.reservaciones.filter(
      (r) =>
        r.nombreCliente.toLowerCase().includes(filtro) ||
        r.tipoServicio.toLowerCase().includes(filtro)
    );
  }

  filtroBusqueda = '';
}
