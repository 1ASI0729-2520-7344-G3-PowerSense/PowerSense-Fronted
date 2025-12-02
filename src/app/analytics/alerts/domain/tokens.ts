import { InjectionToken } from '@angular/core';
import { AlertRepository } from './repositories/alert.repository';

export const ALERT_REPOSITORY = new InjectionToken<AlertRepository>('ALERT_REPOSITORY');


