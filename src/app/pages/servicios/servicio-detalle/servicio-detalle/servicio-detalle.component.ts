import { Component, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ServiciosService } from "../../../../services/servicios/servicios.service";
import { Servicio, ServicioHabitacion, ServicioEvento, ServicioBanquete, TipoServicio } from "../../../../models/servicios.model";

@Component({
  selector: "app-servicio-detalle",
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ServiciosService],
  templateUrl: "./servicio-detalle.component.html",
  styleUrls: ["./servicio-detalle.component.scss"],
})
export class ServicioDetalleComponent implements OnInit {
  // Cambiamos el tipo de `servicio` para soportar las interfaces específicas
  servicio: ServicioHabitacion | ServicioEvento | ServicioBanquete | null = null;
  tipoServicio: TipoServicio | "" = ""; // Usamos el tipo definido en el modelo
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private serviciosService: ServiciosService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.cargarServicio(id);
      }
    });
  }

  cargarServicio(id: string): void {
    // Intentar cargar como habitación
    this.serviciosService.getHabitacion(id).subscribe({
      next: (habitacion) => {
        if (habitacion) {
          this.servicio = habitacion;
          this.tipoServicio = "habitacion";
          this.loading = false;
          return;
        }

        // Intentar cargar como evento
        this.serviciosService.getEvento(id).subscribe({
          next: (evento) => {
            if (evento) {
              this.servicio = evento;
              this.tipoServicio = "evento";
              this.loading = false;
              return;
            }

            // Intentar cargar como banquete
            this.serviciosService.getBanquete(id).subscribe({
              next: (banquete) => {
                if (banquete) {
                  this.servicio = banquete;
                  this.tipoServicio = "banquete";
                  this.loading = false;
                } else {
                  this.loading = false;
                  this.error = "Servicio no encontrado";
                }
              },
              error: () => {
                this.loading = false;
                this.error = "Error al cargar el banquete";
              }
            });
          },
          error: () => {
            this.loading = false;
            this.error = "Error al cargar el evento";
          }
        });
      },
      error: () => {
        this.loading = false;
        this.error = "Error al cargar la habitación";
      }
    });
  }

  // Type guards para verificar el tipo de servicio
  isServicioHabitacion(servicio: ServicioHabitacion | ServicioEvento | ServicioBanquete | null): servicio is ServicioHabitacion {
    return this.tipoServicio === "habitacion" && !!servicio;
  }

  isServicioEvento(servicio: ServicioHabitacion | ServicioEvento | ServicioBanquete | null): servicio is ServicioEvento {
    return this.tipoServicio === "evento" && !!servicio;
  }

  isServicioBanquete(servicio: ServicioHabitacion | ServicioEvento | ServicioBanquete | null): servicio is ServicioBanquete {
    return this.tipoServicio === "banquete" && !!servicio;
  }

  getTipoServicioTexto(): string {
    switch (this.tipoServicio) {
      case "habitacion":
        return "Habitación";
      case "evento":
        return "Evento";
      case "banquete":
        return "Banquete";
      default:
        return "";
    }
  }
  
}