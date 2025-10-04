import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {
  // Define la grilla y las áreas donde se alojan las tarjetas del dashboard.
  // Mantén aquí solo estructura/estilos; cualquier lógica debe vivir en las
  // tarjetas o en la vista orquestadora 'DashboardOverview'.
}
