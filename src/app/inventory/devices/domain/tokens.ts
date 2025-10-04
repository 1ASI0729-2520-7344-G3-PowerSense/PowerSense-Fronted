import { InjectionToken } from '@angular/core';
import { DeviceRepository } from './repositories/device.repository';

export const DEVICE_REPOSITORY = new InjectionToken<DeviceRepository>('DEVICE_REPOSITORY');


