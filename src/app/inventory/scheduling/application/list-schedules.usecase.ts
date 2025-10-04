import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { Schedule } from '../domain/model/schedule';
import { ScheduleQuery } from '../domain/repositories/schedule.repository';

// Listar todas las programaciones con filtros opcionales
@Injectable({ providedIn: 'root' })
export class ListSchedulesUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(query?: ScheduleQuery): Promise<Schedule[]> {
    return this.repository.list(query);
  }
}

