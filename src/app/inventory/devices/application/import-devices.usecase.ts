import { Inject, Injectable } from '@angular/core';
import { DEVICE_REPOSITORY } from '../domain/tokens';
import { Device } from '../domain/model/device.entity';
import { DeviceRepository } from '../domain/repositories/device.repository';

@Injectable({ providedIn: 'root' })
export class ImportDevicesUseCase {

  // Inyección del repositorio usando un token del dominio
  constructor(@Inject(DEVICE_REPOSITORY) private readonly repository: DeviceRepository) {}

  async execute(devices: Omit<Device, 'id'>[]): Promise<void> {
    // Recorre cada dispositivo recibido
    for (const d of devices) {

      // Inserta el dispositivo en el repositorio
      await this.repository.create(d);
    }
  }
}
