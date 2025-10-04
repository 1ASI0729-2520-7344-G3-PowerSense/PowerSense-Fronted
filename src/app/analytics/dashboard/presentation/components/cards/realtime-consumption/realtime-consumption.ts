import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-realtime-consumption-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './realtime-consumption.html',
  styleUrl: './realtime-consumption.css'
})
export class RealtimeConsumption {
  // Card de métrica puntual. Si en el futuro se usa datos en tiempo real,
  // aquí es donde manejaria el servicio que los actualice automáticamente
}
