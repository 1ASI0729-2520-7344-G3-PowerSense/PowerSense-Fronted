import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-realtime-consumption-chart',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonToggleModule, FormsModule, CommonModule],
  templateUrl: './realtime-consumption.html',
  styleUrl: './realtime-consumption.css'
})
export class RealtimeConsumption {
  // Selector simple para cambiar el rango de tiempo mostrado en el gráfico.
  selectedPeriod = 'day';
}
