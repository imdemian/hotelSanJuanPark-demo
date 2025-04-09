import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ServiciosService } from '../../services/servicios/servicios.service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  cargando: boolean = true;

  // Variable para filtrar servicios
  filtroTipo: string = 'todo';

  // Formulario para registrar/editar un servicio
  servicioForm!: FormGroup;
  guardandoServicio: boolean = false;
  modoEditarServicio: boolean = false;
  servicioEditandoId: string | null = null;

  constructor(
    private serviciosService: ServiciosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarServicios();
  }

  // Inicializa el FormGroup para el servicio
  inicializarFormulario(): void {
    this.servicioForm = this.fb.group({
      tipoServicio: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      capacidad: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      precioAdicional: [0],
    });
  }

  // Carga todos los servicios desde el servicio
  cargarServicios(): void {
    this.cargando = true;
    this.serviciosService.getServicios().subscribe({
      next: (data: Servicio[]) => {
        this.servicios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.cargando = false;
      },
    });
  }

  // Getter que devuelve los servicios filtrados según el valor de filtroTipo
  get serviciosFiltrados(): Servicio[] {
    if (this.filtroTipo === 'todo') {
      return this.servicios;
    }
    return this.servicios.filter(
      (s) => s.tipoServicio.toLowerCase() === this.filtroTipo.toLowerCase()
    );
  }

  // Abre el modal en modo "nuevo"
  abrirModalNuevo(): void {
    this.modoEditarServicio = false;
    this.servicioEditandoId = null;
    this.servicioForm.reset();
  }

  // Abre el modal en modo "editar" y carga la información del servicio seleccionado
  abrirModalEditar(servicio: Servicio): void {
    this.modoEditarServicio = true;
    this.servicioEditandoId = servicio.id || null;
    this.servicioForm.patchValue(servicio);
  }

  // Guarda (agrega o actualiza) el servicio
  guardarServicio(): void {
    if (this.servicioForm.invalid || this.guardandoServicio) return;
    this.guardandoServicio = true;
    const data = this.servicioForm.value;
    if (this.modoEditarServicio && this.servicioEditandoId) {
      this.serviciosService
        .actualizarServicio(this.servicioEditandoId, data)
        .then(() => this.finalizarGuardado())
        .catch((err) => {
          console.error('Error al actualizar servicio:', err);
          this.guardandoServicio = false;
        });
    } else {
      this.serviciosService
        .agregarServicio(data)
        .then(() => this.finalizarGuardado())
        .catch((err) => {
          console.error('Error al agregar servicio:', err);
          this.guardandoServicio = false;
        });
    }
  }

  finalizarGuardado(): void {
    this.cargarServicios();
    this.servicioForm.reset();
    this.modoEditarServicio = false;
    this.servicioEditandoId = null;
    this.guardandoServicio = false;
    // Opcional: cerrar el modal si lo manejas con bootstrap (asegúrate de tener la instancia del modal)
  }

  eliminarServicio(id: string): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.serviciosService
        .eliminarServicio(id)
        .then(() => this.cargarServicios())
        .catch((err) => console.error('Error al eliminar servicio:', err));
    }
  }
}
