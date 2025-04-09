import { Routes } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedor/proveedor.component';
import { ClientesComponent } from './pages/clientes/clientes/clientes.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { ServiciosListaComponent } from './pages/servicios/servicios-lista/servicios-lista/servicios-lista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'proveedores', pathMatch: 'full' },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'servicios', component: ServiciosListaComponent },
];