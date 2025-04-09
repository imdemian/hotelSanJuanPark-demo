import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { map } from "rxjs/operators"
import type {
  ServicioHabitacion,
  ServicioEvento,
  ServicioBanquete,
  Promocion,
  ReservaServicio,
} from "../../models/servicios.model" 

type TipoServicio = "habitacion" | "evento" | "banquete"

@Injectable({
  providedIn: "root",
})
export class ServiciosService {
  // Datos de ejemplo para servicios de habitación
  private habitaciones: ServicioHabitacion[] = [
    {
      id: "hab-1",
      tipo: "habitacion",
      nombre: "Habitación Sencilla (1 persona)",
      tipoHabitacion: "sencilla",
      capacidadPersonas: 1,
      incluyeDesayuno: false,
      precio: 880.0,
      precioConDesayuno: 1090.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "hab-2",
      tipo: "habitacion",
      nombre: "Habitación Sencilla (2 personas)",
      tipoHabitacion: "sencilla",
      capacidadPersonas: 2,
      incluyeDesayuno: false,
      precio: 995.0,
      precioConDesayuno: 1415.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "hab-3",
      tipo: "habitacion",
      nombre: "Habitación Doble (2 personas)",
      tipoHabitacion: "doble",
      capacidadPersonas: 2,
      incluyeDesayuno: false,
      precio: 1110.0,
      precioConDesayuno: 1530.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "hab-4",
      tipo: "habitacion",
      nombre: "Habitación Doble (3 personas)",
      tipoHabitacion: "doble",
      capacidadPersonas: 3,
      incluyeDesayuno: false,
      precio: 1225.0,
      precioConDesayuno: 1855.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "hab-5",
      tipo: "habitacion",
      nombre: "Habitación Doble (4 personas)",
      tipoHabitacion: "doble",
      capacidadPersonas: 4,
      incluyeDesayuno: false,
      precio: 1340.0,
      precioConDesayuno: 2180.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "hab-6",
      tipo: "habitacion",
      nombre: "Suite (1 persona)",
      tipoHabitacion: "suite",
      capacidadPersonas: 1,
      incluyeDesayuno: false,
      precio: 1185.0,
      precioConDesayuno: 1395.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "hab-7",
      tipo: "habitacion",
      nombre: "Suite (2 personas)",
      tipoHabitacion: "suite",
      capacidadPersonas: 2,
      incluyeDesayuno: false,
      precio: 1300.0,
      precioConDesayuno: 1720.0,
      activo: true,
      fechaCreacion: new Date(),
    },
  ]

  // Datos de ejemplo para servicios de eventos
  private eventos: ServicioEvento[] = [
    {
      id: "evt-1",
      tipo: "evento",
      nombre: "Salón Magno",
      tipoSalon: "magno",
      capacidadMaxima: 300,
      precio: 6960.0,
      equipoIncluido: ["Cañón", "Audio", "Sillas", "Mesas", "Mantelería", "Agua natural"],
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "evt-2",
      tipo: "evento",
      nombre: "Salón 2/3",
      tipoSalon: "2/3",
      capacidadMaxima: 150,
      precio: 3869.0,
      equipoIncluido: ["Cañón", "Audio", "Sillas", "Mesas", "Mantelería", "Agua natural"],
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "evt-3",
      tipo: "evento",
      nombre: "Salón 1/3",
      tipoSalon: "1/3",
      capacidadMaxima: 80,
      precio: 2252.0,
      equipoIncluido: ["Cañón", "Audio", "Sillas", "Mesas", "Mantelería", "Agua natural"],
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "evt-4",
      tipo: "evento",
      nombre: "Salón Sala",
      tipoSalon: "sala",
      capacidadMaxima: 10,
      precio: 1740.0,
      equipoIncluido: ["Cañón", "Audio", "Sillas", "Mesas", "Mantelería", "Agua natural"],
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "evt-5",
      tipo: "evento",
      nombre: "Salón Royal",
      tipoSalon: "royal",
      capacidadMaxima: 50,
      precio: 3335.0,
      equipoIncluido: ["Cañón", "Audio", "Sillas", "Mesas", "Mantelería", "Agua natural"],
      activo: true,
      fechaCreacion: new Date(),
    },
  ]

  // Datos de ejemplo para servicios de banquetes
  private banquetes: ServicioBanquete[] = [
    {
      id: "ban-1",
      tipo: "banquete",
      nombre: "Desayuno Buffet",
      tipoBanquete: "desayuno",
      precio: 464.0,
      precioUnitario: 464.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-2",
      tipo: "banquete",
      nombre: "Desayuno Montado",
      tipoBanquete: "desayuno",
      precio: 453.0,
      precioUnitario: 453.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-3",
      tipo: "banquete",
      nombre: "Box Lunch",
      tipoBanquete: "lunch",
      precio: 430.0,
      precioUnitario: 430.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-4",
      tipo: "banquete",
      nombre: "Bocadillos Finos",
      tipoBanquete: "bocadillos",
      precio: 422.0,
      precioUnitario: 422.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-5",
      tipo: "banquete",
      nombre: "Antojitos Mexicanos",
      tipoBanquete: "antojitos",
      precio: 430.0,
      precioUnitario: 430.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-6",
      tipo: "banquete",
      nombre: "Menú Comida Ejecutiva",
      tipoBanquete: "comida",
      precio: 730.0,
      precioUnitario: 730.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-7",
      tipo: "banquete",
      nombre: "Menú Comida Evento Social",
      tipoBanquete: "comida",
      precio: 870.0,
      precioUnitario: 870.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-8",
      tipo: "banquete",
      nombre: "Comida Buffet",
      tipoBanquete: "comida",
      precio: 555.0,
      precioUnitario: 555.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-9",
      tipo: "banquete",
      nombre: "Comida Tipo Taquiza",
      tipoBanquete: "comida",
      precio: 638.0,
      precioUnitario: 638.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-10",
      tipo: "banquete",
      nombre: "Menú Cena Ejecutiva (1 Tiempo)",
      tipoBanquete: "cena",
      precio: 406.0,
      precioUnitario: 406.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-11",
      tipo: "banquete",
      nombre: "Menú Cena Evento Social",
      tipoBanquete: "cena",
      precio: 870.0,
      precioUnitario: 870.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-12",
      tipo: "banquete",
      nombre: "Menú Cena Buffet",
      tipoBanquete: "cena",
      precio: 754.0,
      precioUnitario: 754.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-13",
      tipo: "banquete",
      nombre: "Cena Tipo Taquiza",
      tipoBanquete: "cena",
      precio: 638.0,
      precioUnitario: 638.0,
      activo: true,
      fechaCreacion: new Date(),
    },
    {
      id: "ban-14",
      tipo: "banquete",
      nombre: "Parrillada",
      tipoBanquete: "parrillada",
      precio: 905.0,
      precioUnitario: 905.0,
      activo: true,
      fechaCreacion: new Date(),
    },
  ]

  // Promociones disponibles
  private promociones: Promocion[] = [
    {
      id: "promo-1",
      nombre: "Promoción Eventos Sociales",
      descripcion: "Promoción especial para eventos sociales",
      tipoEvento: "XV Años",
      beneficios: [
        "Cortesía de una habitación",
        "Descorche de bebidas sin cargo",
        "Estacionamiento gratuito",
        "Degustación para 4 personas",
      ],
      activo: true,
    },
    {
      id: "promo-2",
      nombre: "Promoción Eventos Sociales",
      descripcion: "Promoción especial para eventos sociales",
      tipoEvento: "Boda",
      beneficios: [
        "Cortesía de una habitación",
        "Descorche de bebidas sin cargo",
        "Estacionamiento gratuito",
        "Degustación para 4 personas",
      ],
      activo: true,
    },
    {
      id: "promo-3",
      nombre: "Promoción Eventos Sociales",
      descripcion: "Promoción especial para eventos sociales",
      tipoEvento: "Bautizo",
      beneficios: [
        "Cortesía de una habitación",
        "Descorche de bebidas sin cargo",
        "Estacionamiento gratuito",
        "Degustación para 4 personas",
      ],
      activo: true,
    },
    {
      id: "promo-4",
      nombre: "Promoción Eventos Sociales",
      descripcion: "Promoción especial para eventos sociales",
      tipoEvento: "Cumpleaños",
      beneficios: [
        "Cortesía de una habitación",
        "Descorche de bebidas sin cargo",
        "Estacionamiento gratuito",
        "Degustación para 4 personas",
      ],
      activo: true,
    },
  ]

  // Reservas de servicios (simulación)
  private reservasServicios: ReservaServicio[] = []

  // BehaviorSubjects para observables
  private habitacionesSubject = new BehaviorSubject<ServicioHabitacion[]>(this.habitaciones)
  private eventosSubject = new BehaviorSubject<ServicioEvento[]>(this.eventos)
  private banquetesSubject = new BehaviorSubject<ServicioBanquete[]>(this.banquetes)
  private promocionesSubject = new BehaviorSubject<Promocion[]>(this.promociones)
  private reservasServiciosSubject = new BehaviorSubject<ReservaServicio[]>(this.reservasServicios)

  constructor() {}

  // Métodos para obtener servicios
  getHabitaciones(): Observable<ServicioHabitacion[]> {
    return this.habitacionesSubject.asObservable()
  }

  getEventos(): Observable<ServicioEvento[]> {
    return this.eventosSubject.asObservable()
  }

  getBanquetes(): Observable<ServicioBanquete[]> {
    return this.banquetesSubject.asObservable()
  }

  getPromociones(): Observable<Promocion[]> {
    return this.promocionesSubject.asObservable()
  }

  getReservasServicios(): Observable<ReservaServicio[]> {
    return this.reservasServiciosSubject.asObservable()
  }

  // Métodos para obtener un servicio específico
  getHabitacion(id: string): Observable<ServicioHabitacion | undefined> {
    return this.getHabitaciones().pipe(map((habitaciones) => habitaciones.find((h) => h.id === id)))
  }

  getEvento(id: string): Observable<ServicioEvento | undefined> {
    return this.getEventos().pipe(map((eventos) => eventos.find((e) => e.id === id)))
  }

  getBanquete(id: string): Observable<ServicioBanquete | undefined> {
    return this.getBanquetes().pipe(map((banquetes) => banquetes.find((b) => b.id === id)))
  }

  getPromocion(id: string): Observable<Promocion | undefined> {
    return this.getPromociones().pipe(map((promociones) => promociones.find((p) => p.id === id)))
  }

  // Método para obtener promociones por tipo de evento
  getPromocionesPorTipoEvento(tipoEvento: string): Observable<Promocion[]> {
    return this.getPromociones().pipe(
      map((promociones) => promociones.filter((p) => p.tipoEvento === tipoEvento && p.activo)),
    )
  }

  // Método para agregar una reserva de servicio
  agregarReservaServicio(reserva: Omit<ReservaServicio, "id" | "fechaCreacion">): Observable<ReservaServicio> {
    const nuevaReserva: ReservaServicio = {
      ...reserva,
      id: `res-${Date.now()}`,
      fechaCreacion: new Date(),
    }

    this.reservasServicios.push(nuevaReserva)
    this.reservasServiciosSubject.next([...this.reservasServicios])

    return of(nuevaReserva)
  }

  // Método para calcular el costo total de una reserva
  calcularCostoTotal(idReserva: string): Observable<number> {
    return this.getReservasServicios().pipe(
      map((reservas) => {
        const reservasDeEstaReserva = reservas.filter((r) => r.idReserva === idReserva)
        return reservasDeEstaReserva.reduce((total, reserva) => total + reserva.subtotal, 0)
      }),
    )
  }

  // Método para verificar disponibilidad (simulado)
  verificarDisponibilidad(tipoServicio: TipoServicio, idServicio: string, fecha: Date): Observable<boolean> {
    // En un caso real, aquí verificaríamos la disponibilidad en la base de datos
    // Para este ejemplo, siempre devolvemos true (disponible)
    return of(true)
  }

  // Método para obtener habitaciones disponibles para cortesía
  getHabitacionesDisponiblesParaCortesia(fecha: Date): Observable<ServicioHabitacion[]> {
    // En un caso real, aquí verificaríamos la disponibilidad en la base de datos
    // Para este ejemplo, devolvemos todas las habitaciones sencillas
    return this.getHabitaciones().pipe(
      map((habitaciones) => habitaciones.filter((h) => h.tipoHabitacion === "sencilla")),
    )
  }
}
