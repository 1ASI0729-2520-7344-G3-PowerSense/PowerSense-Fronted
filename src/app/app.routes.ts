import { Routes } from '@angular/router';
import { DashboardOverview } from './analytics/dashboard/presentation/components/dashboard-page/dashboard-page';
import { UpgradeProComponent } from './shared/presentation/components/upgrade-pro.component';
import { LayoutComponent } from './shared/presentation/components/layout.component';
import { DevicesPage } from './inventory/devices/presentation/components/devices-page/devices-page';
import { SchedulingPage } from './inventory/scheduling/presentation/components/scheduling-page/scheduling-page';
import { ReportsPage } from './analytics/reports/presentation/components/reports-page/reports-page';
import { AlertsPage } from './analytics/alerts/presentation/components/alerts-page/alerts-page';
import { HelpPage } from './support/help/presentation/components/help-page/help-page';
import { LoginComponent } from './auth/presentation/components/login/login';
import { RegisterComponent } from './auth/presentation/components/register/register';
import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';


export const routes: Routes = [
  // Rutas públicas (solo accesibles si NO estás logueado)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard]
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // <-- Guard aplicado aquí
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverview },
      { path: 'devices', component: DevicesPage },
      { path: 'scheduling', component: SchedulingPage },
      { path: 'reports', component: ReportsPage },
      { path: 'alerts', component: AlertsPage },
      { path: 'help', component: HelpPage },
      // { path: 'settings', component: SettingsComponent },
    ]
  },
  { path: 'upgrade', component: UpgradeProComponent }
];
