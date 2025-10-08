import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { API_BASE_URL } from '../../../../../../shared/infrastructure/api.config';

@Component({
  selector: 'app-realtime-consumption-chart',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonToggleModule, FormsModule, CommonModule, NgxChartsModule],
  templateUrl: './realtime-consumption.html',
  styleUrl: './realtime-consumption.css'
})
export class RealtimeConsumption {
  // Selector  para cambiar el rango de tiempo mostrado en el gráfico.
  selectedPeriod = 'day';

  readonly lineColorScheme: Color = {
    name: 'rt-line',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4B5563']
  };

  results: any[] = [];
  private readonly baseUrl = API_BASE_URL;

  constructor(private readonly http: HttpClient) {
    this.loadData();
  }

  async loadData(): Promise<void> {
    // Endpoint esperado (necesario en db.json): /realtime-consumption?period=day|week|month
    // Estructura esperada: [{ name: 'HH:mm'| 'Día' | 'Mes', value: number }, ...]
    try {
      const data = await firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/realtime-consumption`, {
        params: { period: this.selectedPeriod }
      }));
      this.results = Array.isArray(data) ? data : [];
    } catch {
      this.results = [];
    }
  }

  onPeriodChange(): void {
    this.loadData();
  }
}
