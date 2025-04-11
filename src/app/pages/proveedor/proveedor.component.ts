import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Modal } from 'bootstrap';
import { NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  ProveedorService,
  Proveedor,
} from '../../services/proveedor/proveedor.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule],
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedorForm!: FormGroup;
  cargando = true;

  modoEditar = false;
  proveedorEditandoId: string | null = null;

  constructor(
    private proveedorService: ProveedorService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    if (isPlatformBrowser(this.platformId)) {
      this.proveedorService.getProveedores().subscribe((data) => {
        this.proveedores = data;
        this.cargando = false;
      });
    }
  }

  abrirModalNuevo() {
    this.modoEditar = false;
    this.proveedorEditandoId = null;
    this.proveedorForm.reset();
  }

  abrirModalEditar(proveedor: Proveedor) {
    this.modoEditar = true;
    this.proveedorEditandoId = proveedor.id!;
    this.proveedorForm.patchValue({
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      email: proveedor.email,
    });
  }

  guardarProveedor() {
    if (this.proveedorForm.invalid) return;

    const data = this.proveedorForm.value;

    if (this.modoEditar && this.proveedorEditandoId) {
      this.proveedorService
        .actualizarProveedor(this.proveedorEditandoId, data)
        .then(() => {
          this.proveedorForm.reset();
        });
    } else {
      this.proveedorService.agregarProveedor(data).then(() => {
        this.proveedorForm.reset();
      });
    }
  }

  eliminarProveedor(id: string) {
    this.proveedorService.eliminarProveedor(id);
  }

  filtroBusqueda: string = '';

  get proveedoresFiltrados() {
    const filtro = this.filtroBusqueda.trim().toLowerCase();
    if (!filtro) return this.proveedores;
    return this.proveedores.filter((p) =>
      `${p.nombre} ${p.telefono} ${p.email}`.toLowerCase().includes(filtro)
    );
  }
}
