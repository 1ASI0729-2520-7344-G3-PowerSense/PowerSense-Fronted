import { Routes } from '@angular/router';
import { DashboardOverview } from './analytics/dashboard/presentation/components/dashboard-overview/dashboard-overview';
import { UpgradeProComponent } from './shared/presentation/components/upgrade-pro.component';
import { LayoutComponent } from './shared/presentation/components/layout.component';
import { DevicesPage } from './inventory/devices/presentation/components/devices-page/devices-page';
import { SchedulingPage } from './inventory/scheduling/presentation/components/scheduling-page/scheduling-page';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverview },
      { path: 'devices', component: DevicesPage },
      { path: 'scheduling', component: SchedulingPage },
      // { path: 'reports', component: ReportsComponent },
      // { path: 'alerts', component: AlertsComponent },
      // { path: 'settings', component: SettingsComponent },
      // { path: 'help', component: HelpComponent },
    ]
  },
  { path: 'upgrade', component: UpgradeProComponent }
];
