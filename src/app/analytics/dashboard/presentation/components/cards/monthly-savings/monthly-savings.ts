import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-savings',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './monthly-savings.html',
  styleUrl: './monthly-savings.css'
})
export class MonthlySavings {}
// Resumen del ahorro del mes
