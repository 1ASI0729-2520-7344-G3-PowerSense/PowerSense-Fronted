import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saving-tips',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './saving-tips.html',
  styleUrl: './saving-tips.css'
})
export class SavingTips {
  // Consejos cortos y accionables para reducir consumo sin complicaciones.
  tips = [
    'Apaga las luces que no uses',
    'Desconecta cargadores cuando no estén en uso',
    'Usa electrodomésticos en horario valle'
  ];
}
