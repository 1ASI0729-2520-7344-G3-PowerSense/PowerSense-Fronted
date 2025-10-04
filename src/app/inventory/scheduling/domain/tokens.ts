import { InjectionToken } from '@angular/core';
import { ScheduleRepository } from './repositories/schedule.repository';

// Token para inyectar el repositorio de programaciones
export const SCHEDULE_REPOSITORY = new InjectionToken<ScheduleRepository>(
  'schedule.repository',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error('SCHEDULE_REPOSITORY must be provided');
    }
  }
);

