// Importa el decorador Component desde el núcleo de Angular
import { Component } from '@angular/core';

// ============================================================
// 🧩 COMPONENTE: PageNotFoundComponent
// ------------------------------------------------------------
// Este componente se muestra cuando el usuario intenta acceder
// a una ruta que no existe dentro de la aplicación (Error 404).
// ============================================================
@Component({
  selector: 'app-page-not-found',           // Nombre del selector usado en las plantillas HTML
  imports: [],                              // No requiere importar otros módulos o componentes
  templateUrl: './page-not-found.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './page-not-found.component.css'      // Hoja de estilos asociada al componente
})
export class PageNotFoundComponent {
  // El componente no contiene lógica adicional,
  // solo muestra una vista informativa (404 Not Found)
}
