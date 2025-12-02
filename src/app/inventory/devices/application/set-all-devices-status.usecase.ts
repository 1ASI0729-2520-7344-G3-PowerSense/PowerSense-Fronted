import { Inject, Injectable } from '@angular/core';
import { DEVICE_REPOSITORY } from '../domain/tokens';
import { DeviceRepository } from '../domain/repositories/device.repository';

@Injectable({ providedIn: 'root' })
export class SetAllDevicesStatusUseCase {

  // Inyección del repositorio que maneja los dispositivos
  constructor(@Inject(DEVICE_REPOSITORY) private readonly repository: DeviceRepository) {}

  async execute(status: 'active' | 'inactive'): Promise<void> {
    // Obtiene todos los dispositivos del repositorio
    const all = await this.repository.list();

    // Recorre cada dispositivo y actualiza su estado
    for (const device of all) {
      await this.repository.setStatus(device.id, status);
    }
  }
}
