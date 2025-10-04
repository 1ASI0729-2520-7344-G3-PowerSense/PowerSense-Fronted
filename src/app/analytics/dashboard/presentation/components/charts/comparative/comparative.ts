import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comparative',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatOptionModule, FormsModule, CommonModule],
  templateUrl: './comparative.html',
  styleUrl: './comparative.css'
})
export class Comparative {
  // Compara periodos para ver tendencias. Aquí eliges el rango a comparar.
  selectedPeriod = '6m';
}
