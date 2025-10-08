import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { DEVICE_REPOSITORY } from './inventory/devices/domain/tokens';
import { InMemoryDeviceRepository } from './inventory/devices/infrastructure/inmemory-device.repository';
import { HttpDeviceRepository } from './inventory/devices/infrastructure/http-device.repository';
import { SCHEDULE_REPOSITORY } from './inventory/scheduling/domain/tokens';
import { InMemoryScheduleRepository } from './inventory/scheduling/infrastructure/inmemory-schedule.repository';
import { HttpScheduleRepository } from './inventory/scheduling/infrastructure/http-schedule.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    // Para usar la fake API de json-server (puerto 4000):
    { provide: DEVICE_REPOSITORY, useClass: HttpDeviceRepository },
    { provide: SCHEDULE_REPOSITORY, useClass: HttpScheduleRepository }
  ]
};
