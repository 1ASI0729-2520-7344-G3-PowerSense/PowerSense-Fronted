import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-control',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatSlideToggleModule, FormsModule, CommonModule],
  templateUrl: './device-control.html',
  styleUrl: './device-control.css'
})
export class DeviceControl {
  // Tarjeta simple para mostrar controles rápidos de algunos dispositivos.
  // En el módulo de Devices está la lógica completa; aquí solo se ilustra.
  devices = [
    { name: 'Aire acondicionado', on: true },
    { name: 'Luz sala', on: false },
    { name: 'Refrigerador', on: true }
  ];
}
