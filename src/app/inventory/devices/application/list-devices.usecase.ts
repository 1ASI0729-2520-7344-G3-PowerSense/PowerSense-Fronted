import { Inject, Injectable } from '@angular/core';
import { Device } from '../domain/model/device';
import { DeviceQuery, DeviceRepository } from '../domain/repositories/device.repository';
import { DEVICE_REPOSITORY } from '../domain/tokens';

@Injectable({ providedIn: 'root' })
export class ListDevicesUseCase {
  constructor(@Inject(DEVICE_REPOSITORY) private readonly repository: DeviceRepository) {}

  execute(query?: DeviceQuery): Promise<Device[]> {
    return this.repository.list(query);
  }
}


