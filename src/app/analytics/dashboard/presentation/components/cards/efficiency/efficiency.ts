import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-efficiency',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './efficiency.html',
  styleUrl: './efficiency.css'
})
export class Efficiency {}
// Indicador rápido de qué tan bien estamos usando la energía.
