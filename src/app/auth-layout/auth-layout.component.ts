// Importa las dependencias necesarias desde el núcleo de Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Este componente actúa como layout (diseño base) para las vistas
// relacionadas con la autenticación, como login o registro.
// Utiliza RouterOutlet para renderizar las rutas hijas.
// ============================================================
@Component({
  selector: 'app-auth-layout',                     // Selector del componente utilizado en la plantilla principal
  standalone: true,                                // Permite que el componente funcione sin necesidad de un módulo Angular
  imports: [RouterOutlet],                         // Habilita el uso del RouterOutlet dentro de la plantilla
  templateUrl: './auth-layout.component.html',     // Archivo de plantilla HTML asociado
  styleUrl: './auth-layout.component.css'          // Archivo de estilos del layout
})
export class AuthLayoutComponent {
  // No contiene lógica adicional, su función principal es
  // servir como contenedor para las vistas de autenticación.
}
