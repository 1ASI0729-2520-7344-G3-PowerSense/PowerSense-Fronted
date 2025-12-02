import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { DEVICE_REPOSITORY } from './inventory/devices/domain/tokens';
import { InMemoryDeviceRepository } from './inventory/devices/infrastructure/inmemory-device.repository';
import { HttpDeviceRepository } from './inventory/devices/infrastructure/http-device.repository';
import { SCHEDULE_REPOSITORY } from './inventory/scheduling/domain/tokens';
import { InMemoryScheduleRepository } from './inventory/scheduling/infrastructure/inmemory-schedule.repository';
import { HttpScheduleRepository } from './inventory/scheduling/infrastructure/http-schedule.repository';
import { ALERT_REPOSITORY } from './analytics/alerts/domain/tokens';
import { HttpAlertRepository } from './analytics/alerts/infrastructure/http-alert.repository';

// Auth providers
import { AUTH_REPOSITORY } from './auth/domain/tokens';
import { HttpAuthRepository } from './auth/infrastructure/http-auth.repository';
import { AuthStorageService } from './auth/infrastructure/storage/auth-storage.service';
import { authInterceptor } from './auth/infrastructure/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Interceptor JWT
    ),
    provideAnimations(),

    // Repositorios conectados al backend Spring Boot (puerto 8080):
    { provide: DEVICE_REPOSITORY, useClass: HttpDeviceRepository },
    // NOTA: Schedule Rules NO existen en el backend, usando InMemory para desarrollo
    { provide: SCHEDULE_REPOSITORY, useClass: InMemoryScheduleRepository },
    { provide: ALERT_REPOSITORY, useClass: HttpAlertRepository },

    // Auth providers
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },
    AuthStorageService
  ]
};
