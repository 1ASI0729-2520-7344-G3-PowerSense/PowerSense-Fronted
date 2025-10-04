import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { Schedule, CreateScheduleDTO } from '../domain/model/schedule';

// Crear una nueva programación para un dispositivo
@Injectable({ providedIn: 'root' })
export class CreateScheduleUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(schedule: CreateScheduleDTO): Promise<Schedule> {
    // Validar que el dispositivo no tenga ya una programación
    const existing = await this.repository.getByDeviceId(schedule.deviceId);
    if (existing) {
      throw new Error('Este dispositivo ya tiene una programación. Usa actualizar en su lugar.');
    }

    return this.repository.create(schedule);
  }
}

