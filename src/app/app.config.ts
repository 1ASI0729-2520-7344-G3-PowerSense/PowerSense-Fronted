import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';


// Device repository
import { DEVICE_REPOSITORY } from './inventory/devices/domain/tokens';
import { HttpDeviceRepository } from './inventory/devices/infrastructure/http-device.repository';

// Schedule repository
import { SCHEDULE_REPOSITORY } from './inventory/scheduling/domain/tokens';
import { HttpScheduleRepository } from './inventory/scheduling/infrastructure/http-schedule.repository';

// Auth
import { AUTH_REPOSITORY } from './auth/domain/tokens';
import { HttpAuthRepository } from './auth/infrastructure/http-auth.repository';
import { authInterceptor } from './auth/infrastructure/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),

    // Repositories
    { provide: DEVICE_REPOSITORY, useClass: HttpDeviceRepository },
    { provide: SCHEDULE_REPOSITORY, useClass: HttpScheduleRepository },
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository }
  ]
};
