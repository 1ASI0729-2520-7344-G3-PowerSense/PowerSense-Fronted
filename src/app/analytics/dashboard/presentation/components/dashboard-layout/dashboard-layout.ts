import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {
  // Define la grilla y las áreas donde se posicionan las tarjetas del dashboard.
  // es solo para estructura/estilos; cualquier lógica debe estar en las
  // tarjetas o en 'Dashboard-pages'.
}
