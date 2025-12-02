import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { API_BASE_URL } from '../../../../../../shared/infrastructure/api.config';

@Component({
  selector: 'app-comparative',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatOptionModule, FormsModule, CommonModule, NgxChartsModule],
  templateUrl: './comparative.html',
  styleUrl: './comparative.css'
})
export class Comparative {
  // Compara periodos para ver tendencias. Aquí se elige el rango a comparar.
  selectedPeriod = '6m';

  readonly lineColorScheme: Color = {
    name: 'dash-line',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4B5563', '#D1D5DB']
  };

  results: any[] = [];
  private readonly baseUrl = API_BASE_URL;
  private monthlyNormalized: Array<{ month: string; y2023: number; y2024: number }> = [];

  constructor(private readonly http: HttpClient) {
    this.loadMonthly();
  }

  async loadMonthly(): Promise<void> {
    const data = await firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/analytics/reports/monthly-comparison`));
    this.monthlyNormalized = Array.isArray(data)
      ? data.filter(m => typeof m.y2023 === 'number' && typeof m.y2024 === 'number').map(m => ({ month: String(m.month), y2023: Number(m.y2023), y2024: Number(m.y2024) }))
      : [];
    this.updateSeries();
  }

  onPeriodChange(): void {
    this.updateSeries();
  }

  private updateSeries(): void {
    const take = this.selectedPeriod === '3m' ? 3 : this.selectedPeriod === '6m' ? 6 : 12;
    const slice = this.monthlyNormalized.slice(-take);
    this.results = [
      { name: '2024', series: slice.map(m => ({ name: m.month, value: m.y2024 })) },
      { name: '2023', series: slice.map(m => ({ name: m.month, value: m.y2023 })) }
    ];
  }
}
