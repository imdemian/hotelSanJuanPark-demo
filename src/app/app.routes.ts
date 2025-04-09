import type { Routes } from "@angular/router"
import { ProveedoresComponent } from "./pages/proveedor/proveedor.component"
import { ClientesComponent } from "./pages/clientes/clientes/clientes.component"
import { EmpleadosComponent } from "./pages/empleados/empleados.component"
import { ServiciosListaComponent } from "./pages/servicios/servicios-lista/servicios-lista/servicios-lista.component"
import { ServicioDetalleComponent } from "./pages/servicios/servicio-detalle/servicio-detalle/servicio-detalle.component"
import { ReservaServicioComponent } from "./pages/servicios/reserva-servicio/reserva-servicio/reserva-servicio/reserva-servicio.component"

export const routes: Routes = [
  {
    path: "dashboard",
    component: ProveedoresComponent,
  },
  {
    path: "proveedores",
    component: ProveedoresComponent,
  },
  {
    path: "clientes",
    component: ClientesComponent,
  },
  {
    path: "empleados",
    component: EmpleadosComponent,
    data: { roles: ["administradora", "gerente", "dueño"] },
  },
  // Rutas para el módulo de servicios - Orden corregido
  {
    path: "servicios",
    children: [
      { path: "", component: ServiciosListaComponent },
      { path: "nuevo", component: ReservaServicioComponent },
      { path: "reserva", component: ReservaServicioComponent },
      { path: "editar/:id", component: ServicioDetalleComponent },
      { path: ":id", component: ServicioDetalleComponent },
    ],
  },
  // Otras rutas
  {
    path: "reservaciones",
    component: ClientesComponent, // Cambia esto por tu componente de reservaciones
  },
  {
    path: "habitaciones",
    component: ClientesComponent, // Cambia esto por tu componente de habitaciones
  },
]
