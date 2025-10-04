import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { Schedule, ScheduleId } from '../domain/model/schedule';

// Activar o desactivar una programación
@Injectable({ providedIn: 'root' })
export class ToggleScheduleUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(id: ScheduleId, enabled: boolean): Promise<Schedule> {
    return this.repository.toggleEnabled(id, enabled);
  }
}

