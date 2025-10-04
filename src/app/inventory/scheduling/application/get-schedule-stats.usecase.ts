import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { ScheduleStats } from '../domain/repositories/schedule.repository';

// Obtener estadísticas de programaciones
@Injectable({ providedIn: 'root' })
export class GetScheduleStatsUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(): Promise<ScheduleStats> {
    return this.repository.getStats();
  }
}

