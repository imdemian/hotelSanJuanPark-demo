// src/app/pages/usuarios/usuarios.component.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  // Se agregan los módulos necesarios para que funcione ngModel y formGroup
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioForm!: FormGroup;
  cargando: boolean = true;

  modoEditar: boolean = false;
  usuarioEditandoId: string | null = null;

  // Propiedad para el filtro de búsqueda
  filtroBusqueda: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario reactivo con validaciones
    this.usuarioForm = this.fb.group({
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      activo: [true],
      fechaRegistro: [new Date(), Validators.required],
      idEmpleado: [''],
    });

    if (isPlatformBrowser(this.platformID)) {
      this.usuarioService.getUsuarios().subscribe((data) => {
        this.usuarios = data;
        this.cargando = false;
      });
    }
  }

  // Abre el modal para agregar un nuevo usuario
  abrirModalNuevo(): void {
    this.modoEditar = false;
    this.usuarioEditandoId = null;
    this.usuarioForm.reset();
    // Opcional: Reinicializa algunos campos predeterminados
    this.usuarioForm.patchValue({ activo: true, fechaRegistro: new Date() });
  }

  // Prepara el formulario para editar el usuario seleccionado
  abrirModalEditar(usuario: Usuario): void {
    this.modoEditar = true;
    this.usuarioEditandoId = usuario.id || null;
    this.usuarioForm.patchValue({
      usuario: usuario.usuario,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      fechaRegistro: usuario.fechaRegistro,
      idEmpleado: usuario.idEmpleado || '',
    });
  }

  // Guarda el usuario, validando si es un nuevo registro o una actualización
  guardarUsuario(): void {
    if (this.usuarioForm.invalid) return;
    const data = this.usuarioForm.value;

    if (this.modoEditar && this.usuarioEditandoId) {
      this.usuarioService
        .actualizarUsuario(this.usuarioEditandoId, data)
        .then(() => {
          this.usuarioForm.reset();
        })
        .catch((error) => console.error('Error actualizando usuario: ', error));
    } else {
      this.usuarioService
        .agregarUsuario(data)
        .then(() => {
          this.usuarioForm.reset();
        })
        .catch((error) => console.error('Error agregando usuario: ', error));
    }
  }

  // Elimina un usuario dado su id
  eliminarUsuario(id: string): void {
    this.usuarioService
      .eliminarUsuario(id)
      .catch((error) => console.error('Error eliminando usuario: ', error));
  }

  // Retorna la lista de usuarios filtrados según el valor ingresado en filtroBusqueda
  get usuariosFiltrados(): Usuario[] {
    if (!this.filtroBusqueda.trim()) return this.usuarios;
    return this.usuarios.filter((u) =>
      `${u.usuario} ${u.email} ${u.rol}`
        .toLowerCase()
        .includes(this.filtroBusqueda.trim().toLowerCase())
    );
  }
}
