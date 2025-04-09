import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router"; // Importación corregida
import { AuthService } from "../../services/auth/auth.service";
import { Usuario } from "../../models/usuario.model";

@Component({
  selector: "app-registro",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.scss"],
})
export class RegistroComponent {
  newUser: Omit<Usuario, "id" | "fechaRegistro"> = {
    usuario: "",
    email: "",
    rol: "recepcionista",
    activo: true,
  };

  password = "";
  confirmPassword = "";
  errorMessage = "";
  successMessage = "";
  loading = false;

  roles = [
    { value: "dueño", label: "Dueño" },
    { value: "administradora", label: "Administradora" },
    { value: "recepcionista", label: "Recepcionista" },
    { value: "gerente", label: "Gerente" },
  ];

  constructor(
    private authService: AuthService,
    private router: Router, // Ahora está correctamente inyectado
  ) {}

  async onRegister() {
    this.loading = true;
    this.errorMessage = "";
    this.successMessage = "";

    if (!this.newUser.usuario || !this.newUser.email || !this.password) {
      this.errorMessage = "Por favor completa todos los campos requeridos";
      this.loading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Las contraseñas no coinciden";
      this.loading = false;
      return;
    }

    try {
      const user = await this.authService.registerUser(this.newUser);
      this.successMessage = `Usuario registrado exitosamente. Tu ID es: ${user.id}`;

      this.newUser = {
        usuario: "",
        email: "",
        rol: "recepcionista",
        activo: true,
      };
      this.password = "";
      this.confirmPassword = "";

      setTimeout(() => {
        this.router.navigate(["/login"]); // Ahora funcionará correctamente
      }, 3000);
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      this.errorMessage = error.message || "Error al registrar usuario";
    } finally {
      this.loading = false;
    }
  }
}