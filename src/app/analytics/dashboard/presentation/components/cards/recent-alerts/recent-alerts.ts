import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-alerts',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './recent-alerts.html',
  styleUrl: './recent-alerts.css'
})
export class RecentAlerts {
  // Últimos avisos para enterarse rápido de lo importante sin abrir reportes.
  alerts = [
    { type: 'error', icon: 'error', message: 'Consumo excesivo detectado', date: '01/10 14:32' },
    { type: 'warning', icon: 'warning', message: 'Pico de energía registrado', date: '01/10 13:10' },
    { type: 'info', icon: 'check_circle', message: 'Luces automáticas configuradas', date: '01/10 08:00' }
  ];
}
