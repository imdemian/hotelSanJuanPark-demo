import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ServiciosService } from "../../../../services/servicios/servicios.service"
import type { Servicio, ServicioHabitacion, ServicioEvento, ServicioBanquete } from "../../../../models/servicios.model"

@Component({
  selector: "app-servicios-lista",
  standalone: true,
  providers: [ServiciosService],
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./servicios-lista.component.html",
  styleUrls: ["./servicios-lista.component.scss"],
})
export class ServiciosListaComponent implements OnInit {
  habitaciones: ServicioHabitacion[] = []
  eventos: ServicioEvento[] = []
  banquetes: ServicioBanquete[] = []

  filtroTipo: "todos" | "habitacion" | "evento" | "banquete" = "todos"
  filtroBusqueda = ""

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios()
  }

  cargarServicios(): void {
    this.serviciosService.getHabitaciones().subscribe((habitaciones) => {
      this.habitaciones = habitaciones
    })

    this.serviciosService.getEventos().subscribe((eventos) => {
      this.eventos = eventos
    })

    this.serviciosService.getBanquetes().subscribe((banquetes) => {
      this.banquetes = banquetes
    })
  }

  get serviciosFiltrados(): Servicio[] {
    let servicios: Servicio[] = []

    if (this.filtroTipo === "todos" || this.filtroTipo === "habitacion") {
      servicios = [...servicios, ...this.habitaciones]
    }

    if (this.filtroTipo === "todos" || this.filtroTipo === "evento") {
      servicios = [...servicios, ...this.eventos]
    }

    if (this.filtroTipo === "todos" || this.filtroTipo === "banquete") {
      servicios = [...servicios, ...this.banquetes]
    }

    if (this.filtroBusqueda) {
      const busqueda = this.filtroBusqueda.toLowerCase()
      servicios = servicios.filter(
        (servicio) =>
          servicio.nombre.toLowerCase().includes(busqueda) || servicio.descripcion?.toLowerCase().includes(busqueda),
      )
    }

    return servicios
  }

  getTipoServicioTexto(tipo: string): string {
    switch (tipo) {
      case "habitacion":
        return "Habitación"
      case "evento":
        return "Evento"
      case "banquete":
        return "Banquete"
      default:
        return tipo
    }
  }
}
