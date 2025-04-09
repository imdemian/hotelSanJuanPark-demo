import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { ServiciosService } from "../../../../../services/servicios/servicios.service"
import type {
  Servicio,
  ServicioHabitacion,
  ServicioEvento,
  ServicioBanquete,
  Promocion,
} from '../../../../../models/servicios.model';

interface ServicioEventoExtendido extends ServicioEvento {
  capacidadMaxima: number
}

interface ServicioBanqueteExtendido extends ServicioBanquete {
  precioUnitario: number
}

@Component({
  selector: "app-reserva-servicio",
  standalone: true,
  providers: [ServiciosService],
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./reserva-servicio.component.html",
  styleUrls: ["./reserva-servicio.component.scss"],
})
export class ReservaServicioComponent implements OnInit {
  // Paso actual del formulario
  pasoActual = 1

  // Datos de la reserva
  idReserva = `RES-${Date.now()}`
  tipoServicioSeleccionado: "habitacion" | "evento" | "banquete" | null = null
  servicioSeleccionado:
    | (Servicio & {
        capacidadMaxima?: number
        precioUnitario?: number
      })
    | null = null
  cantidad = 1
  fechaInicio = ""
  fechaFin = ""

  // Datos específicos para eventos
  tipoEvento = ""
  aplicarPromociones = false
  promocionesDisponibles: Promocion[] = []
  promocionesSeleccionadas: Promocion[] = []
  habitacionCortesia: ServicioHabitacion | null = null
  habitacionesDisponibles: ServicioHabitacion[] = []

  // Datos para banquetes
  cantidadPersonas = 0

  // Listas de servicios
  habitaciones: ServicioHabitacion[] = []
  eventos: ServicioEventoExtendido[] = []
  banquetes: ServicioBanqueteExtendido[] = []

  // Resumen de la reserva
  serviciosAgregados: {
    servicio: Servicio & { precioUnitario?: number }
    cantidad: number
    subtotal: number
    promociones?: Promocion[]
    habitacionCortesia?: ServicioHabitacion
  }[] = []

  costoTotal = 0

  tiposEvento = ["XV Años", "Boda", "Bautizo", "Cumpleaños", "Conferencia", "Reunión", "Otro"]

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios()
    this.setFechasPorDefecto()
  }

  cargarServicios(): void {
    this.serviciosService.getHabitaciones().subscribe((habitaciones) => {
      this.habitaciones = habitaciones
    })

    this.serviciosService.getEventos().subscribe((eventos) => {
      this.eventos = eventos as ServicioEventoExtendido[]
    })

    this.serviciosService.getBanquetes().subscribe((banquetes) => {
      this.banquetes = banquetes as ServicioBanqueteExtendido[]
    })
  }

  setFechasPorDefecto(): void {
    const hoy = new Date()
    const manana = new Date()
    manana.setDate(hoy.getDate() + 1)

    this.fechaInicio = this.formatearFecha(hoy)
    this.fechaFin = this.formatearFecha(manana)
  }

  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split("T")[0]
  }

  seleccionarTipoServicio(tipo: "habitacion" | "evento" | "banquete"): void {
    this.tipoServicioSeleccionado = tipo
    this.servicioSeleccionado = null
    this.cantidad = 1

    if (tipo === "evento") {
      this.tipoEvento = ""
      this.aplicarPromociones = false
      this.promocionesSeleccionadas = []
      this.habitacionCortesia = null
    } else if (tipo === "banquete") {
      this.cantidadPersonas = 0
    }

    this.pasoActual = 2
  }

  seleccionarServicio(servicio: Servicio): void {
    this.servicioSeleccionado = servicio

    if (servicio.tipo === "evento") {
      this.pasoActual = 3
    } else if (servicio.tipo === "banquete") {
      this.pasoActual = 4
    } else {
      this.pasoActual = 5
    }
  }

  cargarPromociones(): void {
    if (this.tipoEvento && ["XV Años", "Boda", "Bautizo", "Cumpleaños"].includes(this.tipoEvento)) {
      this.serviciosService.getPromocionesPorTipoEvento(this.tipoEvento).subscribe((promociones) => {
        this.promocionesDisponibles = promociones
        this.promocionesSeleccionadas = [...promociones] // Por defecto seleccionamos todas
      })

      // Cargar habitaciones disponibles para cortesía
      this.serviciosService
        .getHabitacionesDisponiblesParaCortesia(new Date(this.fechaInicio))
        .subscribe((habitaciones) => {
          this.habitacionesDisponibles = habitaciones
          if (habitaciones.length > 0) {
            this.habitacionCortesia = habitaciones[0] // Seleccionamos la primera por defecto
          }
        })
    } else {
      this.promocionesDisponibles = []
      this.promocionesSeleccionadas = []
      this.habitacionCortesia = null
    }
  }

  cambiarTipoEvento(): void {
    this.cargarPromociones()
  }

  togglePromocion(promocion: Promocion): void {
    const index = this.promocionesSeleccionadas.findIndex((p) => p.id === promocion.id)
    if (index >= 0) {
      this.promocionesSeleccionadas.splice(index, 1)
    } else {
      this.promocionesSeleccionadas.push(promocion)
    }
  }

  isPromocionSeleccionada(promocion: Promocion): boolean {
    return this.promocionesSeleccionadas.some((p) => p.id === promocion.id)
  }

  calcularSubtotal(): number {
    if (!this.servicioSeleccionado) return 0

    let precio = this.servicioSeleccionado.precio

    if (this.servicioSeleccionado.tipo === "habitacion") {
      const habitacion = this.servicioSeleccionado as ServicioHabitacion
      if (habitacion.incluyeDesayuno && habitacion.precioConDesayuno) {
        precio = habitacion.precioConDesayuno
      }
    }

    if (this.servicioSeleccionado.tipo === "banquete") {
      return precio * this.cantidadPersonas
    }

    return precio * this.cantidad
  }

  agregarServicio(): void {
    if (!this.servicioSeleccionado) return

    const subtotal = this.calcularSubtotal()

    const nuevoServicio = {
      servicio: this.servicioSeleccionado,
      cantidad: this.servicioSeleccionado.tipo === "banquete" ? this.cantidadPersonas : this.cantidad,
      subtotal,
      promociones:
        this.servicioSeleccionado.tipo === "evento" && this.aplicarPromociones
          ? [...this.promocionesSeleccionadas]
          : undefined,
      habitacionCortesia:
        this.servicioSeleccionado.tipo === "evento" && this.aplicarPromociones && this.habitacionCortesia
          ? this.habitacionCortesia
          : undefined,
    }

    this.serviciosAgregados.push(nuevoServicio)
    this.actualizarCostoTotal()

    // Reiniciar selección
    this.tipoServicioSeleccionado = null
    this.servicioSeleccionado = null
    this.cantidad = 1
    this.cantidadPersonas = 0
    this.aplicarPromociones = false
    this.promocionesSeleccionadas = []
    this.habitacionCortesia = null

    this.pasoActual = 1
  }

  eliminarServicio(index: number): void {
    this.serviciosAgregados.splice(index, 1)
    this.actualizarCostoTotal()
  }

  actualizarCostoTotal(): void {
    this.costoTotal = this.serviciosAgregados.reduce((total, item) => total + item.subtotal, 0)
  }

  guardarReserva(): void {
    // Aquí se guardaría la reserva en la base de datos
    // Para este ejemplo, solo mostramos un mensaje
    alert(`Reserva ${this.idReserva} guardada con éxito. Costo total: ${this.costoTotal.toFixed(2)}`)

    // Reiniciar formulario
    this.serviciosAgregados = []
    this.costoTotal = 0
    this.pasoActual = 1
    this.idReserva = `RES-${Date.now()}`
  }

  cancelarReserva(): void {
    if (confirm("¿Estás seguro de cancelar esta reserva? Se perderán todos los datos.")) {
      this.serviciosAgregados = []
      this.costoTotal = 0
      this.pasoActual = 1
      this.idReserva = `RES-${Date.now()}`
    }
  }

  volverPaso(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--
    }
  }
}
