import { Inject, Injectable } from '@angular/core';
import { Device, DeviceId } from '../domain/model/device.entity';
import { DeviceRepository } from '../domain/repositories/device.repository';
import { DEVICE_REPOSITORY } from '../domain/tokens';

@Injectable({ providedIn: 'root' })
export class SetDeviceStatusUseCase {
  constructor(@Inject(DEVICE_REPOSITORY) private readonly repository: DeviceRepository) {}

  execute(id: DeviceId, status: 'active' | 'inactive'): Promise<Device> {
    return this.repository.setStatus(id, status);
  }
}


