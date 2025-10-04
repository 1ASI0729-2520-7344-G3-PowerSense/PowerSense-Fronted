import { Inject, Injectable } from '@angular/core';
import { DEVICE_REPOSITORY } from '../domain/tokens';
import { DeviceRepository } from '../domain/repositories/device.repository';

@Injectable({ providedIn: 'root' })
export class SetAllDevicesStatusUseCase {
  constructor(@Inject(DEVICE_REPOSITORY) private readonly repository: DeviceRepository) {}

  async execute(status: 'active' | 'inactive'): Promise<void> {
    const all = await this.repository.list();
    for (const device of all) {
      // eslint-disable-next-line no-await-in-loop
      await this.repository.setStatus(device.id, status);
    }
  }
}


