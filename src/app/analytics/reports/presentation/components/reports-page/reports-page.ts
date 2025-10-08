import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ReportsMonthlyLineChart } from '../charts/monthly-line/monthly-line';
import { ReportsDepartmentsBarChart } from '../charts/departments-bar/departments-bar';
import { API_BASE_URL } from '../../../../../shared/infrastructure/api.config';

type ReportType = 'consumption' | 'costs' | 'efficiency';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    ReportsMonthlyLineChart,
    ReportsDepartmentsBarChart
  ],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css'
})
export class ReportsPage {
  @ViewChild('monthlyChart') private monthlyChartRef?: ElementRef<HTMLElement>;
  @ViewChild('departmentChart') private departmentChartRef?: ElementRef<HTMLElement>;
  // Filtros
  selectedReportType: ReportType = 'consumption';
  startDate = '';
  endDate = '';

  // KPI signals
  readonly totalConsumption = signal<number>(0); // kWh
  readonly totalCost = signal<number>(0); // $
  readonly efficiency = signal<number>(0); // %
  readonly varConsumption = signal<number>(0);
  readonly varCost = signal<number>(0);
  readonly varEfficiency = signal<number>(0);

  // Tabla de historial
  readonly displayedColumns = ['date', 'name', 'type', 'variation', 'actions'];
  readonly history = signal<Array<{ date: string; name: string; type: string; variation: number }>>([]);

  // Datos para futuros gráficos
  readonly monthly = signal<Array<{ month: string; y2023: number; y2024: number }>>([]);
  readonly departments = signal<Array<{ departmentId: string; departmentName: string; metric: string; value: number }>>([]);

  // Datos transformados para ngx-charts
  readonly monthlyLineResults = signal<any[]>([]);
  readonly departmentBarResults = signal<any[]>([]);

  // Esquemas de color (alineados al design system)
  readonly lineColorScheme: Color = {
    name: 'ps-line',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4B5563', '#D1D5DB']
  };
  readonly barColorScheme: Color = {
    name: 'ps-bar',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10B981']
  };

  private readonly baseUrl = API_BASE_URL;

  constructor(private readonly http: HttpClient) {
    this.loadData();
  }

  applyFilters(): void {
    // Por ahora recargamos los mismos endpoints; en el futuro se pueden aplicar parámetros.
    this.loadData();
  }

  isPositive(value: number): boolean {
    return value >= 0;
  }

  private async loadData(): Promise<void> {
    // Cargar KPIs
    const kpisPromise = firstValueFrom(this.http.get<any>(`${this.baseUrl}/reports-kpis`));
    const monthlyPromise = firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/reports-monthly`));
    const departmentsPromise = firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/reports-departments`));
    const historyPromise = firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/reports-history`));

    const [kpis, monthlyData, departmentsData, historyData] = await Promise.all([
      kpisPromise,
      monthlyPromise,
      departmentsPromise,
      historyPromise
    ]);

    // Asignar KPIs
    this.totalConsumption.set(Number(kpis?.totalConsumptionKWh ?? 0));
    this.totalCost.set(Number(kpis?.totalCostUSD ?? 0));
    this.efficiency.set(Number(kpis?.efficiencyPct ?? 0));
    this.varConsumption.set(Number(kpis?.comparison?.consumptionPct ?? 0));
    this.varCost.set(Number(kpis?.comparison?.costPct ?? 0));
    this.varEfficiency.set(Number(kpis?.comparison?.efficiencyPct ?? 0));

    // Asignar datos de gráficos (placeholders por ahora)
    const monthlyNormalized = Array.isArray(monthlyData)
      ? monthlyData.map(m => ({ month: String(m.month), y2023: Number(m.y2023), y2024: Number(m.y2024) }))
      : [];
    this.monthly.set(monthlyNormalized);

    const departmentsNormalized = Array.isArray(departmentsData)
      ? departmentsData.map(d => ({
          departmentId: String(d.departmentId),
          departmentName: String(d.departmentName),
          metric: String(d.metric),
          value: Number(d.value)
        }))
      : [];
    this.departments.set(departmentsNormalized);

    // Historial
    this.history.set(
      Array.isArray(historyData)
        ? historyData.map(h => ({
            date: String(h.date),
            name: String(h.name),
            type: String(h.type),
            variation: Number(h.variationPct ?? 0)
          }))
        : []
    );

    // Transformaciones a formato ngx-charts
    const lineResults = [
      {
        name: '2024',
        series: monthlyNormalized.map(m => ({ name: m.month, value: m.y2024 }))
      },
      {
        name: '2023',
        series: monthlyNormalized.map(m => ({ name: m.month, value: m.y2023 }))
      }
    ];
    this.monthlyLineResults.set(lineResults);

    const barResults = departmentsNormalized.map(d => ({ name: d.departmentName, value: d.value }));
    this.departmentBarResults.set(barResults);
  }

  // Acciones descarga (placeholder)
  downloadMonthly(): void {
    const host = this.monthlyChartRef?.nativeElement;
    if (host) this.exportChartAsPng(host, 'consumo-mensual.png');
  }

  downloadDepartments(): void {
    const host = this.departmentChartRef?.nativeElement;
    if (host) this.exportChartAsPng(host, 'comparativa-departamentos.png');
  }

  private exportChartAsPng(container: HTMLElement, filename: string): void {
    const svg = container.querySelector('svg');
    if (!svg) return;

    const cloned = svg.cloneNode(true) as SVGSVGElement;
    const width = (svg as SVGSVGElement).clientWidth || 800;
    const height = (svg as SVGSVGElement).clientHeight || 400;
    cloned.setAttribute('width', String(width));
    cloned.setAttribute('height', String(height));

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(cloned);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = filename;
      a.click();
    };
    img.src = url;
  }

  // Exportaciones de historial
  exportHistoryCsv(): void {
    const rows = this.history();
    const header = ['date', 'name', 'type', 'variation'];
    const csv = [header.join(',')]
      .concat(
        rows.map(r => [r.date, r.name, r.type, String(r.variation)].map(v => `"${v}"`).join(','))
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial-reportes.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  exportHistoryPdf(): void {
    // Implementación simple: imprimir la tabla (PDF desde el diálogo de impresión del navegador)
    // Para PDF real sin diálogo, integrar jsPDF/autotable en otra iteración.
    window.print();
  }
}


