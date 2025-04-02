import { Routes } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedor/proveedor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'proveedores', pathMatch: 'full' },
  { path: 'proveedores', component: ProveedoresComponent },
];
