import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleados/empleados.service';
import { Empleado } from '../../models/empleado.model';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { finalize } from 'rxjs/operators';

declare var bootstrap: any;

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadoForm!: FormGroup;
  cargando = true;
  guardando = false;
  modoEditar = false;
  empleadoEditandoId: string | null = null;
  filtroBusqueda: string = '';
  mostrarFiltros: boolean = false;
  modalInstance: any = null;

  constructor(
    private empleadoService: EmpleadoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarEmpleados();
  }

  inicializarFormulario(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      sexo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      puesto: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      activo: [true]
    });
  }

  cargarEmpleados(): void {
    this.cargando = true;
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
        this.cargando = false;
      }
    });
  }

  abrirModalNuevo(): void {
    this.modoEditar = false;
    this.empleadoEditandoId = null;
    this.empleadoForm.reset({ activo: true });
    this.inicializarModal();
  }

  abrirModalEditar(empleado: Empleado): void {
    this.modoEditar = true;
    this.empleadoEditandoId = empleado.id || null;
    
    // Asegurarse de que la fecha esté en el formato correcto
    const fechaFormateada = this.formatDateForInput(empleado.fechaIngreso);
    console.log('Fecha original:', empleado.fechaIngreso);
    console.log('Fecha formateada:', fechaFormateada);
    
    // Limpiar el formulario antes de establecer nuevos valores
    this.empleadoForm.reset();
    
    // Establecer los valores del empleado en el formulario
    this.empleadoForm.patchValue({
      nombre: empleado.nombre || '',
      apellidoPaterno: empleado.apellidoPaterno || '',
      apellidoMaterno: empleado.apellidoMaterno || '',
      edad: empleado.edad || '',
      sexo: empleado.sexo || '',
      correo: empleado.correo || '',
      telefono: empleado.telefono || '',
      puesto: empleado.puesto || '',
      fechaIngreso: fechaFormateada,
      activo: empleado.activo !== undefined ? empleado.activo : true
    });
    
    this.inicializarModal();
    
    // Verificar si los datos se cargaron correctamente
    console.log('Datos cargados en el formulario:', this.empleadoForm.value);
  }

  inicializarModal(): void {
    setTimeout(() => {
      const modalEl = document.getElementById('modalAgregarEmpleado');
      if (modalEl) {
        this.modalInstance = new bootstrap.Modal(modalEl);
        this.modalInstance.show();
      }
    }, 100);
  }

  guardarEmpleado(): void {
    if (this.empleadoForm.invalid || this.guardando) return;

    this.guardando = true;
    
    const empleadoData = {
      ...this.empleadoForm.value,
      fechaIngreso: new Date(this.empleadoForm.value.fechaIngreso)
    };

    if (this.modoEditar && this.empleadoEditandoId) {
      // Actualizar empleado existente
      this.empleadoService.actualizarEmpleado(this.empleadoEditandoId, empleadoData)
        .then(() => {
          this.finalizarGuardado();
        })
        .catch(error => {
          console.error('Error al actualizar empleado:', error);
          this.guardando = false;
        });
    } else {
      // Agregar nuevo empleado
      this.empleadoService.agregarEmpleado(empleadoData)
        .then(() => {
          this.finalizarGuardado();
        })
        .catch(error => {
          console.error('Error al agregar empleado:', error);
          this.guardando = false;
        });
    }
  }

  finalizarGuardado(): void {
    this.cargarEmpleados();
    this.empleadoForm.reset({ activo: true });
    this.modoEditar = false;
    this.empleadoEditandoId = null;
    this.guardando = false;
    
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  eliminarEmpleado(id: string): void {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(id)
        .then(() => {
          this.cargarEmpleados();
        })
        .catch(error => console.error('Error al eliminar:', error));
    }
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  get empleadosFiltrados(): Empleado[] {
    if (!this.filtroBusqueda || !this.filtroBusqueda.trim()) {
      return this.empleados;
    }
    
    const busqueda = this.filtroBusqueda.toLowerCase().trim();
    
    return this.empleados.filter(e => {
      const nombreCompleto = [
        e.nombre || '',
        e.apellidoPaterno || '',
        e.apellidoMaterno || ''
      ].join(' ').toLowerCase();
      
      const otrosCampos = [
        e.correo || '',
        e.puesto || '',
        e.telefono || ''
      ].join(' ').toLowerCase();
      
      return nombreCompleto.includes(busqueda) || otrosCampos.includes(busqueda);
    });
  }

  private formatDateForInput(date: any): string {
    if (!date) return '';
    
    try {
      // Verificar si es un objeto Timestamp de Firestore
      if (date && typeof date.toDate === 'function') {
        date = date.toDate();
      }
      
      const d = new Date(date);
      // Verificar si la fecha es válida
      if (isNaN(d.getTime())) return '';
      
      // Formato YYYY-MM-DD para input type="date"
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }
}