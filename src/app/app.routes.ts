import { Routes } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedor/proveedor.component';
import { ClientesComponent } from './pages/clientes/clientes/clientes.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';
import { ReservacionesComponent } from './pages/reservaciones/reservaciones.component';

export const routes: Routes = [
  { path: '', redirectTo: 'proveedores', pathMatch: 'full' },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'ordenesdecompra', component: OrdenesComponent},
  { path: 'reservaciones', component: ReservacionesComponent },
];
