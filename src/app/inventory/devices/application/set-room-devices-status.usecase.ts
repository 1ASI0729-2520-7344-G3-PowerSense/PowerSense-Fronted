import { Inject, Injectable } from '@angular/core';
import { DEVICE_REPOSITORY } from '../domain/tokens';
import { DeviceRepository } from '../domain/repositories/device.repository';

@Injectable({ providedIn: 'root' })
export class SetRoomDevicesStatusUseCase {
  constructor(@Inject(DEVICE_REPOSITORY) private readonly repository: DeviceRepository) {}

  async execute(roomId: string, status: 'active' | 'inactive'): Promise<void> {
    const devices = await this.repository.list({ roomId });
    for (const device of devices) {
      await this.repository.setStatus(device.id, status);
    }
  }
}


