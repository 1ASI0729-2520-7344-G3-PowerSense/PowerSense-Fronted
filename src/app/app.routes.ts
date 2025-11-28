import { Routes } from '@angular/router';
import { DashboardOverview } from './analytics/dashboard/presentation/components/dashboard-page/dashboard-page';
import { UpgradeProComponent } from './shared/presentation/components/upgrade-pro.component';
import { LayoutComponent } from './shared/presentation/components/layout.component';
import { DevicesPage } from './inventory/devices/presentation/components/devices-page/devices-page';
import { SchedulingPage } from './inventory/scheduling/presentation/components/scheduling-page/scheduling-page';
import { ReportsPage } from './analytics/reports/presentation/components/reports-page/reports-page';
import { LoginComponent } from './auth/presentation/components/login/login';
import { RegisterComponent } from './auth/presentation/components/register/register';
import { ProfileComponent } from './auth/presentation/components/profile/profile';
import { authGuardSync, guestGuardSync } from './auth/guards';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuardSync],
    title: 'Iniciar Sesión'
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuardSync],
    title: 'Registrarse'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuardSync],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardOverview,
        title: 'Dashboard'
      },
      {
        path: 'devices',
        component: DevicesPage,
        title: 'Dispositivos'
      },
      {
        path: 'scheduling',
        component: SchedulingPage,
        title: 'Programación'
      },
      {
        path: 'reports',
        component: ReportsPage,
        title: 'Reportes'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Perfil'
      }
    ]
  },
  {
    path: 'upgrade',
    component: UpgradeProComponent,
    canActivate: [authGuardSync],
    title: 'Actualizar a Pro'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
