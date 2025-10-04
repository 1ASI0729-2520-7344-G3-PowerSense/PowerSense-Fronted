import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { ScheduleId } from '../domain/model/schedule';

// Eliminar una programación
@Injectable({ providedIn: 'root' })
export class DeleteScheduleUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(id: ScheduleId): Promise<void> {
    await this.repository.delete(id);
  }
}

