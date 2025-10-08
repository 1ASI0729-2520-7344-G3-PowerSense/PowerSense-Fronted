import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estimated-costs',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './estimated-costs.html',
  styleUrl: './estimated-costs.css'
})
export class EstimatedCosts {
  // Muestra un estimado de costos.
}
