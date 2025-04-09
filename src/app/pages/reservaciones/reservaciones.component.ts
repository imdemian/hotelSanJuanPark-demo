import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservacionService } from '../../services/reservaciones/reservaciones.service';
import { ClienteService } from '../../services/clientes/cliente.service'; // Asegúrate de tener este servicio
import { Reservacion } from '../../models/reservacion.model';
import { Cliente } from '../../models/cliente.model'; // Define Cliente con nombre, telefono, correo, etc.

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.scss'],
})
export class ReservacionesComponent implements OnInit {
  reservacionForm!: FormGroup;
  reservaciones: Reservacion[] = [];
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  busquedaCliente = '';
  modoEditar = false;
  cargando = true;
  filtroBusqueda = '';
  reservacionEditandoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reservacionService: ReservacionService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.reservacionService.getReservaciones().subscribe((data) => {
      this.reservaciones = data;
      this.cargando = false;
    });

    this.clienteService.getClientes().subscribe((clientes) => {
      this.clientes = clientes;
    });
  }

  inicializarFormulario() {
    this.reservacionForm = this.fb.group({
      tipoServicio: ['habitacion', Validators.required],
      nombreCliente: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: [''],
      // ... otros campos
    });
  }

  filtrarClientes() {
    const filtro = this.busquedaCliente.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(filtro) ||
        c.telefono?.toLowerCase().includes(filtro)
    );
  }

  seleccionarCliente(clienteId: string) {
    const cliente = this.clientes.find((c) => c.id === clienteId);
    if (cliente) {
      this.reservacionForm.patchValue({
        nombreCliente: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo,
      });
    }
  }

  guardarReservacion() {
    const data = this.reservacionForm.value;
    if (this.modoEditar && this.reservacionEditandoId) {
      this.reservacionService.actualizarReservacion(
        this.reservacionEditandoId,
        data
      );
    } else {
      this.reservacionService.agregarReservacion(data);
    }
    this.reservacionForm.reset();
  }

  abrirModalNuevo() {
    this.reservacionForm.reset({ tipoServicio: 'habitacion' });
    this.modoEditar = false;
    this.busquedaCliente = '';
    this.clientesFiltrados = [];
  }

  abrirModalEditar(reserva: Reservacion) {
    this.modoEditar = true;
    this.reservacionEditandoId = reserva.id!;
    this.reservacionForm.patchValue(reserva);
  }

  eliminarReservacion(id: string) {
    this.reservacionService.eliminarReservacion(id);
  }
}
