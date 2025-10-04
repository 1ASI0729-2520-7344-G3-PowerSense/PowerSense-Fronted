import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RealtimeConsumption as CardRealtimeConsumption } from '../cards/realtime-consumption/realtime-consumption';
import { EstimatedCosts } from '../cards/estimated-costs/estimated-costs';
import { MonthlySavings } from '../cards/monthly-savings/monthly-savings';
import { Efficiency } from '../cards/efficiency/efficiency';
import { DeviceControl } from '../cards/device-control/device-control';
import { SavingTips } from '../cards/saving-tips/saving-tips';
import { RecentAlerts } from '../cards/recent-alerts/recent-alerts';
import { RealtimeConsumption as ChartRealtimeConsumption } from '../charts/realtime-consumption/realtime-consumption';
import { Comparative } from '../charts/comparative/comparative';
import { DashboardLayout } from '../dashboard-layout/dashboard-layout';

@Component({
  selector: 'app-dashboard-overview',
  imports: [
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    CardRealtimeConsumption,
    EstimatedCosts,
    MonthlySavings,
    Efficiency,
    DeviceControl,
    SavingTips,
    RecentAlerts,
    ChartRealtimeConsumption,
    Comparative,
    DashboardLayout
  ],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css'
})
export class DashboardOverview {
  // Vista orquestadora del dashboard. No contiene lógica de negocio;
  // compone tarjetas y gráficos en el layout definido en 'DashboardLayout'.
  // Si necesitas pasar datos/inputs a las tarjetas, este es el punto central.
}
