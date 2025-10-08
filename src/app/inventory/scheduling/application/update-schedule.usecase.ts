import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { Schedule, ScheduleId, UpdateScheduleDTO } from '../domain/model/schedule.entity';

// Actualizar una programación existente
@Injectable({ providedIn: 'root' })
export class UpdateScheduleUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(id: ScheduleId, schedule: UpdateScheduleDTO): Promise<Schedule> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error('Programación no encontrada');
    }

    return this.repository.update(id, schedule);
  }
}

